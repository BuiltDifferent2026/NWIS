import re
from typing import Optional, Tuple, Any, Union

def clean_text(val: Any) -> str:
    """Normalize text: trim, normalize whitespace and punctuation."""
    if val is None:
        return ""
    s = str(val).strip()
    s = re.sub(r'\s+', ' ', s)
    return s

def normalize_label(label: str) -> str:
    """Normalize label string for alias matching (lowercase, no extra spaces or trailing colons)."""
    s = clean_text(label).lower()
    s = re.sub(r'[:\-–—\.]+$', '', s).strip()
    s = re.sub(r'\s+', ' ', s)
    return s

def extract_number_and_unit(val: Any, default_unit: Optional[str] = None) -> Tuple[Optional[float], Optional[str]]:
    """
    Extract float number and unit from raw text or numeric cell.
    Examples:
      '2,145 m' -> (2145.0, 'm')
      '10.2 ppg' -> (10.2, 'ppg')
      '2.5 hrs' -> (2.5, 'hrs')
      '11000' -> (11000.0, default_unit)
      2145 -> (2145.0, default_unit)
    """
    if val is None:
        return None, default_unit

    if isinstance(val, (int, float)):
        return float(val), default_unit

    s = clean_text(val)
    if not s:
        return None, default_unit

    # Check for ratios like 45/42 or dates like 2026-09-24 which are not single numbers
    if re.match(r'^\d{4}-\d{2}-\d{2}', s):
        return None, default_unit
    if re.match(r'^\d+/\d+$', s):
        return None, default_unit

    # Regex to find first valid number and optional trailing unit
    # Handles 2,145, 11000, 10.2, 0, etc.
    match = re.search(r'([+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?)\s*([a-zA-Z/%_]+(?:\s*[a-zA-Z0-9/%_-]+)*)?', s)
    if match:
        num_str = match.group(1).replace(',', '')
        try:
            num = float(num_str)
            unit_found = match.group(2)
            unit = unit_found.strip() if unit_found else default_unit
            return num, unit
        except ValueError:
            pass

    return None, default_unit

def extract_npt_from_narrative(text: str) -> Tuple[Optional[float], Optional[float]]:
    """
    Extract daily and monthly cumulative NPT from pattern like:
    'NPT in 24 hrs: 2.5 hrs, Cumm monthly NPT: 14.0 hrs' or 'NPT in 24 hrs: 0 hrs, Cumm monthly NPT:0 hrs'
    Returns (npt_24h, cum_monthly_npt)
    """
    if not text:
        return None, None

    npt_24h = None
    cum_npt = None

    # Daily NPT pattern
    m_daily = re.search(r'npt\s*(?:in\s*24\s*hrs|24h|24\s*hrs)?\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*(?:hrs|h)?', text, re.IGNORECASE)
    if m_daily:
        try:
            npt_24h = float(m_daily.group(1))
        except ValueError:
            pass

    # Cumulative NPT pattern
    m_cum = re.search(r'cum[m]?\s*(?:monthly\s*npt|npt)?\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*(?:hrs|h)?', text, re.IGNORECASE)
    if m_cum:
        try:
            cum_npt = float(m_cum.group(1))
        except ValueError:
            pass

    return npt_24h, cum_npt

def parse_colon_value(label_text: str) -> Tuple[str, Optional[str]]:
    """
    If a cell contains label and value separated by a colon, e.g.:
      'Well: WELL_A' -> ('Well', 'WELL_A')
      'Hrs Lost: 2.5' -> ('Hrs Lost', '2.5')
      'Rig Release from last LOC: LOC-P0' -> ('Rig Release from last LOC', 'LOC-P0')
    """
    if not label_text or ':' not in label_text:
        return label_text, None

    parts = label_text.split(':', 1)
    label = parts[0].strip()
    val = parts[1].strip() if len(parts) > 1 and parts[1].strip() else None
    return label, val

def compute_relative_depth(present_depth: Optional[float], formation_top: Optional[float]) -> Optional[float]:
    """
    Compute formation-relative depth: present_depth_md_m - top_md_m
    Returns relative depth in meters or None if either value is missing.
    """
    if present_depth is not None and formation_top is not None:
        return round(present_depth - formation_top, 2)
    return None
