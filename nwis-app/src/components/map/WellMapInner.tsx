'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  CircleMarker, 
  Popup, 
  Circle, 
  Polyline, 
  useMap, 
  useMapEvents 
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { WELLS, Well, haversineDistance, computeSimilarity } from '../../data/wells';
import { StatusBadge } from '../common/StatusBadge';
import { 
  MapPin, 
  Compass, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Crosshair, 
  Sparkles, 
  Download, 
  Layers, 
  Navigation, 
  Radio, 
  X,
  SlidersHorizontal,
  Share2,
  ArrowUpDown
} from 'lucide-react';
import Link from 'next/link';

export interface CustomCoordinatePin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  depthMD?: number;
  formation?: string;
  color: string;
  notes?: string;
}

interface WellMapInnerProps {
  selectedField: string;
  searchQuery: string;
  radiusKm: number;
  centerWellId: string;
  sortBy: 'distance' | 'similarity';
  onSortByChange?: (mode: 'distance' | 'similarity') => void;
}

// ─── Preset Reference Locations in Seven Sisters & Pan-India Basins ───
const INDIAN_BASIN_PRESETS = [
  {
    name: 'Geleki South Pad (Assam)',
    lat: 26.9280,
    lng: 94.6520,
    formation: 'Tipam Sandstone',
    depthMD: 2350,
    color: '#F59E0B'
  },
  {
    name: 'Digboi Historical Discovery (Assam)',
    lat: 27.3800,
    lng: 95.6300,
    formation: 'Bhuban Member',
    depthMD: 1820,
    color: '#10B981'
  },
  {
    name: 'Rokhia Gas Pad (Tripura)',
    lat: 23.6350,
    lng: 91.1980,
    formation: 'Bhuban Gas Sand',
    depthMD: 2950,
    color: '#06B6D4'
  },
  {
    name: 'Kumchai Foothills Pad (Arunachal)',
    lat: 27.3200,
    lng: 96.0250,
    formation: 'Girujan / Tipam Fault',
    depthMD: 3450,
    color: '#8B5CF6'
  },
  {
    name: 'Changpang Strike Pad (Nagaland)',
    lat: 26.0420,
    lng: 94.1350,
    formation: 'Barail Main Sand',
    depthMD: 2850,
    color: '#F43F5E'
  },
  {
    name: 'Bilkhawthlir Frontier Pad (Mizoram)',
    lat: 24.1680,
    lng: 92.7350,
    formation: 'Surma Fold Belt',
    depthMD: 4200,
    color: '#EC4899'
  },
  {
    name: 'Barmer Mangala Pad (Rajasthan)',
    lat: 25.8200,
    lng: 71.2500,
    formation: 'Fatehgarh Sandstone',
    depthMD: 1450,
    color: '#EAB308'
  },
  {
    name: 'Ankleshwar Pad (Gujarat)',
    lat: 21.6250,
    lng: 72.9900,
    formation: 'Ankleshwar Sand',
    depthMD: 1350,
    color: '#14B8A6'
  },
  {
    name: 'KG-D6 Deepwater Target (AP)',
    lat: 16.3100,
    lng: 82.3500,
    formation: 'Pliocene Deepwater Channel',
    depthMD: 3100,
    color: '#3B82F6'
  },
  {
    name: 'Mumbai High North (Offshore MH)',
    lat: 19.4200,
    lng: 71.3500,
    formation: 'L-III Carbonate Reservoir',
    depthMD: 2100,
    color: '#6366F1'
  }
];

const ASSAM_BASIN_PRESETS = INDIAN_BASIN_PRESETS;

// ─── Default Sample Custom Pins ───
const INITIAL_CUSTOM_PINS: CustomCoordinatePin[] = [
  {
    id: 'pin-glk-relief-1',
    name: 'Geleki South Relief Pad',
    lat: 26.9280,
    lng: 94.6520,
    depthMD: 2350,
    formation: 'Tipam Sandstone',
    color: '#F59E0B'
  },
  {
    id: 'pin-glk-fault-b',
    name: 'Seismic Target GLK-14-S',
    lat: 26.8950,
    lng: 94.6180,
    depthMD: 2190,
    formation: 'Girujan Transition',
    color: '#06B6D4'
  }
];

// Helper: Convert Decimal Degrees to DMS format
function toDMS(coord: number, isLat: boolean): string {
  const absolute = Math.abs(coord);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60 * 10) / 10;
  const direction = isLat ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
  return `${degrees}°${minutes}'${seconds}"${direction}`;
}

function formatCoords(lat: number, lng: number, format: 'DD' | 'DMS'): string {
  if (format === 'DMS') {
    return `${toDMS(lat, true)} ${toDMS(lng, false)}`;
  }
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

// ─── Leaflet Map Interactive Controller ───
function MapInteractiveController({
  isPicking,
  onPick,
  zoomTarget,
  centerCoords,
  radiusKm
}: {
  isPicking: boolean;
  onPick: (lat: number, lng: number) => void;
  zoomTarget: [number, number] | null;
  centerCoords?: [number, number];
  radiusKm?: number;
}) {
  const map = useMap();

  // Fly to zoomTarget when explicitly triggered (e.g. clicking a custom pin or preset)
  useEffect(() => {
    if (zoomTarget) {
      map.flyTo(zoomTarget, 12, { duration: 1.2 });
    }
  }, [zoomTarget, map]);

  // Smoothly pan & scale zoom when center well changes or radius expands significantly
  useEffect(() => {
    if (centerCoords && centerCoords[0] && centerCoords[1]) {
      let targetZoom = 10;
      if (radiusKm) {
        if (radiusKm <= 25) targetZoom = 11;
        else if (radiusKm <= 50) targetZoom = 10;
        else if (radiusKm <= 100) targetZoom = 9;
        else if (radiusKm <= 350) targetZoom = 7;
        else if (radiusKm <= 1000) targetZoom = 6;
        else targetZoom = 5;
      }
      map.flyTo(centerCoords, targetZoom, { duration: 1.0 });
    }
  }, [centerCoords?.[0], centerCoords?.[1], radiusKm, map]);

  useMapEvents({
    click(e) {
      if (isPicking) {
        onPick(e.latlng.lat, e.latlng.lng);
      }
    }
  });

  return null;
}

export const WellMapInner: React.FC<WellMapInnerProps> = ({
  selectedField,
  searchQuery,
  radiusKm,
  centerWellId,
  sortBy,
  onSortByChange
}) => {
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);
  
  // Theme state dynamically detected from page
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const checkDark = () => {
      if (typeof document !== 'undefined') {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
      }
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);
  
  // Dedicated Tab State in Sidebar: default to 'offsets' so ranking is immediately visible
  const [sidebarTab, setSidebarTab] = useState<'offsets' | 'coordinates'>('offsets');

  // Auto-switch to 'offsets' tab whenever ranking mode changes so the user instantly sees the reordered list
  useEffect(() => {
    setSidebarTab('offsets');
  }, [sortBy]);
  
  // Custom Coordinates State
  const [customPins, setCustomPins] = useState<CustomCoordinatePin[]>(INITIAL_CUSTOM_PINS);
  const [isPickingLocation, setIsPickingLocation] = useState<boolean>(false);
  const [coordFormat, setCoordFormat] = useState<'DD' | 'DMS'>('DD');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [zoomTarget, setZoomTarget] = useState<[number, number] | null>(null);

  // Form input states
  const [inputName, setInputName] = useState('');
  const [inputLat, setInputLat] = useState('');
  const [inputLng, setInputLng] = useState('');
  const [inputFormation, setInputFormation] = useState('');
  const [inputDepth, setInputDepth] = useState('');
  const [inputColor, setInputColor] = useState('#F59E0B');
  const [formError, setFormError] = useState('');

  const centerWell = WELLS.find((w) => w.id === centerWellId) || WELLS[0];
  const centerLat = centerWell.coordinates.surfaceLat;
  const centerLng = centerWell.coordinates.surfaceLng;

  // Filter offset wells
  const filteredWells = WELLS.filter((w) => {
    if (selectedField !== 'all' && w.field.toLowerCase() !== selectedField.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.field.toLowerCase().includes(q) ||
        w.block.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate distance and similarity for all wells relative to centerWell
  const wellsWithMetrics = filteredWells.map((w) => {
    const dist = haversineDistance(centerLat, centerLng, w.coordinates.surfaceLat, w.coordinates.surfaceLng);
    const sim = computeSimilarity(centerWell, w);
    return {
      well: w,
      distanceKm: Math.round(dist * 10) / 10,
      similarity: sim,
      inRadius: dist <= radiusKm
    };
  });

  // Exclude centerWell from the offset candidate ranking (center well is the active reference, not its own offset)
  const offsetWellsWithMetrics = wellsWithMetrics.filter((m) => m.well.id !== centerWell.id);

  // Sort offset wells by chosen metric
  const sortedWells = [...offsetWellsWithMetrics].sort((a, b) => {
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    return b.similarity.total - a.similarity.total;
  });

  // The #1 leading offset well under current ranking criteria
  const topRankedOffset = sortedWells[0];

  // Clipboard copy handler with temporary feedback
  const handleCopy = async (text: string, id: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((prev) => (prev === id ? null : prev));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy coordinates:', err);
    }
  };

  // Map Click Coordinate Capture
  const handleMapPick = (lat: number, lng: number) => {
    setInputLat(lat.toFixed(6));
    setInputLng(lng.toFixed(6));
    if (!inputName) {
      setInputName(`Plotted Pin #${customPins.length + 1}`);
    }
    setIsPickingLocation(false);
  };

  // Add custom pin submit
  const handleAddPin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const latNum = parseFloat(inputLat);
    const lngNum = parseFloat(inputLng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      setFormError('Please enter valid numeric latitude and longitude.');
      return;
    }

    if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setFormError('Coordinates out of range (-90 to 90 lat, -180 to 180 lng).');
      return;
    }

    const newPin: CustomCoordinatePin = {
      id: `pin-${Date.now()}`,
      name: inputName.trim() || `Target Point ${customPins.length + 1}`,
      lat: latNum,
      lng: lngNum,
      formation: inputFormation.trim() || undefined,
      depthMD: inputDepth ? parseFloat(inputDepth) : undefined,
      color: inputColor
    };

    setCustomPins((prev) => [newPin, ...prev]);
    setZoomTarget([latNum, lngNum]);

    // Reset inputs
    setInputName('');
    setInputLat('');
    setInputLng('');
    setInputFormation('');
    setInputDepth('');
  };

  // Delete custom pin
  const handleDeletePin = (id: string) => {
    setCustomPins((prev) => prev.filter((p) => p.id !== id));
  };

  // Apply a preset
  const handleApplyPreset = (preset: typeof ASSAM_BASIN_PRESETS[0]) => {
    setInputName(preset.name);
    setInputLat(preset.lat.toFixed(6));
    setInputLng(preset.lng.toFixed(6));
    setInputFormation(preset.formation);
    setInputDepth(preset.depthMD.toString());
    setInputColor(preset.color);
    setZoomTarget([preset.lat, preset.lng]);
  };

  // Batch copy all coordinates
  const handleCopyAllCoordinates = () => {
    const lines = [
      `=== INDIAN BASINS & SEVEN SISTERS GEOSPATIAL REGISTER ===`,
      `Active Well: ${centerWell.name} (${centerWell.field} Field)`,
      `Surface Coordinates: ${formatCoords(centerLat, centerLng, coordFormat)}`,
      `Depth MD: ${centerWell.totalDepthMD}m | Rig: ${centerWell.rig}`,
      ``,
      `--- PLOTTED CUSTOM PINS (${customPins.length}) ---`,
      ...customPins.map((p, idx) => {
        const dist = Math.round(haversineDistance(centerLat, centerLng, p.lat, p.lng) * 10) / 10;
        return `${idx + 1}. [${p.name}] ${formatCoords(p.lat, p.lng, coordFormat)} | Dist: ${dist}km | Fm: ${p.formation || 'N/A'} | Depth: ${p.depthMD || 'N/A'}m`;
      }),
      ``,
      `--- OFFSET WELLS IN BASIN (${sortedWells.length}) ---`,
      ...sortedWells.map((w, idx) => {
        return `${idx + 1}. ${w.well.name} (${w.well.field}) | ${formatCoords(w.well.coordinates.surfaceLat, w.well.coordinates.surfaceLng, coordFormat)} | Dist: ${w.distanceKm}km | Sim: ${Math.round(w.similarity.total * 100)}%`;
      })
    ];

    handleCopy(lines.join('\n'), 'copy-all-batch');
  };

  const getMarkerColor = (well: Well) => {
    if (well.id === centerWell.id) return '#ED1C24'; // Brand Red for active rig
    if (well.status === 'drilling') return '#3FAE68'; // Success
    if (well.status === 'completed') return '#26A69A'; // Teal Dark
    if (well.status === 'suspended') return '#F2B84B'; // Warning
    return '#6B7280';
  };

  // Mapbox Integration
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
  const [mapLayerStyle, setMapLayerStyle] = useState<'theme' | 'satellite' | 'outdoors'>('theme');

  // Compute active tile URL and attribution based on Mapbox token availability and user style choice
  const getTileConfig = () => {
    if (mapboxToken && mapboxToken.trim().length > 0) {
      let styleId = isDarkMode ? 'dark-v11' : 'light-v11';
      if (mapLayerStyle === 'satellite') styleId = 'satellite-streets-v12';
      if (mapLayerStyle === 'outdoors') styleId = 'outdoors-v12';

      return {
        isMapbox: true,
        url: `https://api.mapbox.com/styles/v1/mapbox/${styleId}/tiles/{z}/{x}/{y}?access_token=${mapboxToken.trim()}`,
        attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        tileSize: 512,
        zoomOffset: -1
      };
    }

    // Default Fallback when Mapbox Token is not yet provided in .env
    return {
      isMapbox: false,
      url: isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '© <a href="https://carto.com/">CARTO</a> © <a href="https://openstreetmap.org">OSM</a>',
      tileSize: 256,
      zoomOffset: 0
    };
  };

  const tileConfig = getTileConfig();

  return (
    <div className="relative flex flex-col xl:flex-row h-full w-full gap-4 min-h-[580px] xl:h-[640px]">
      
      {/* ─── Map Viewport (Matches Page Theme) ─── */}
      <div className={`flex-1 relative rounded-none overflow-hidden border border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#191E26] min-h-[480px] xl:h-full shadow-2xs ${
        isPickingLocation ? 'cursor-crosshair ring-2 ring-[#3FC3B6]' : ''
      }`}>

        {/* ─── Mapbox / Tile Layer Control & Indicator ─── */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
          {tileConfig.isMapbox ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 dark:bg-[#242D3B]/95 backdrop-blur-xs border border-[#26A69A] text-[10px] font-mono font-bold text-[#26A69A] dark:text-[#3FC3B6] shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#3FAE68] animate-pulse" />
              <span>MAPBOX API ACTIVE</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/90 dark:bg-[#242D3B]/90 backdrop-blur-xs border border-[#E2E5E8] dark:border-[#364356] text-[10px] font-mono text-[#6B7280] dark:text-[#94A3B8] shadow-xs">
              <Layers className="w-3 h-3 text-[#26A69A]" />
              <span>CARTOGRAPHIC BASE (Add token in .env for Mapbox)</span>
            </div>
          )}

          {/* Quick Style Switcher (Standard, Satellite, Outdoors) */}
          {tileConfig.isMapbox && (
            <div className="inline-flex items-center bg-white/95 dark:bg-[#242D3B]/95 border border-[#E2E5E8] dark:border-[#364356] p-0.5 shadow-md">
              <button
                type="button"
                onClick={() => setMapLayerStyle('theme')}
                className={`px-2 py-0.5 text-[10px] font-mono font-bold transition-colors ${
                  mapLayerStyle === 'theme'
                    ? 'bg-[#26A69A] text-white'
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
                }`}
              >
                {isDarkMode ? 'Dark' : 'Light'}
              </button>
              <button
                type="button"
                onClick={() => setMapLayerStyle('satellite')}
                className={`px-2 py-0.5 text-[10px] font-mono font-bold transition-colors ${
                  mapLayerStyle === 'satellite'
                    ? 'bg-[#26A69A] text-white'
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
                }`}
              >
                Satellite
              </button>
              <button
                type="button"
                onClick={() => setMapLayerStyle('outdoors')}
                className={`px-2 py-0.5 text-[10px] font-mono font-bold transition-colors ${
                  mapLayerStyle === 'outdoors'
                    ? 'bg-[#26A69A] text-white'
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
                }`}
              >
                Terrain
              </button>
            </div>
          )}
        </div>
        
        {/* Picking Location Floating Guidance Banner */}
        {isPickingLocation && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#34435A] text-white border-2 border-[#3FC3B6] px-4 py-2 rounded-none font-mono text-xs font-bold shadow-xl flex items-center gap-3 animate-bounce">
            <Crosshair className="w-4 h-4 text-[#3FC3B6] animate-spin" />
            <span>CLICK ANYWHERE ON THE MAP TO CAPTURE COORDINATES</span>
            <button
              type="button"
              onClick={() => setIsPickingLocation(false)}
              className="ml-2 bg-[#222222] hover:bg-[#222222]/80 p-1 text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Active Ranking Mode Floating HUD on Map */}
        <div className="absolute top-3 left-3 z-20 bg-white/95 dark:bg-[#1E2532]/95 backdrop-blur-xs border border-[#E2E5E8] dark:border-[#364356] p-2.5 shadow-md font-mono text-xs max-w-[320px] pointer-events-auto">
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#E2E5E8] dark:border-[#364356]">
            <div className="flex items-center gap-1.5 font-bold">
              {sortBy === 'similarity' ? (
                <>
                  <Compass className="w-3.5 h-3.5 text-[#26A69A] dark:text-[#3FC3B6]" />
                  <span className="text-[#26A69A] dark:text-[#3FC3B6] text-[11px]">MODE: SIMILARITY</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span className="text-[#D97706] dark:text-[#F59E0B] text-[11px]">MODE: DISTANCE</span>
                </>
              )}
            </div>
            {onSortByChange && (
              <div className="inline-flex rounded-none border border-[#E2E5E8] dark:border-[#364356] p-0.5 bg-[#F5F7F8] dark:bg-[#191E26]">
                <button
                  type="button"
                  onClick={() => onSortByChange('similarity')}
                  className={`px-1.5 py-0.5 text-[9px] font-bold cursor-pointer transition-colors ${
                    sortBy === 'similarity'
                      ? 'bg-[#26A69A] text-white'
                      : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33]'
                  }`}
                  title="Rank by Geological & Stratigraphic Similarity"
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => onSortByChange('distance')}
                  className={`px-1.5 py-0.5 text-[9px] font-bold cursor-pointer transition-colors ${
                    sortBy === 'distance'
                      ? 'bg-[#F59E0B] text-black'
                      : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33]'
                  }`}
                  title="Rank by Geographic Radial Distance"
                >
                  Dist
                </button>
              </div>
            )}
          </div>

          {topRankedOffset && (
            <div className="pt-1.5 space-y-0.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#6B7280] dark:text-[#94A3B8]">
                  {sortBy === 'similarity' ? '🏆 Top Analog:' : '📍 Nearest Offset:'}
                </span>
                <span className="font-bold text-[#252B33] dark:text-white">{topRankedOffset.well.name}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#6B7280] dark:text-[#94A3B8]">
                <span>Distance: {topRankedOffset.distanceKm} km</span>
                <span className="font-bold text-[#3FAE68]">{Math.round(topRankedOffset.similarity.total * 100)}% Match</span>
              </div>
            </div>
          )}
        </div>

        <MapContainer
          center={[centerLat, centerLng]}
          zoom={10}
          scrollWheelZoom={true}
          className="h-full w-full z-10"
          style={{ background: isDarkMode ? '#191E26' : '#E2E8F0' }}
        >
          {/* Map interactive handler for clicks and programmatic zooming */}
          <MapInteractiveController
            isPicking={isPickingLocation}
            onPick={handleMapPick}
            zoomTarget={zoomTarget}
            centerCoords={[centerLat, centerLng]}
            radiusKm={radiusKm}
          />

          {/* Map Tile Layer: Mapbox Tiles when token is provided, with fallback to Carto/OSM */}
          <TileLayer
            key={`${tileConfig.isMapbox ? 'mapbox' : 'fallback'}-${mapLayerStyle}-${isDarkMode ? 'dark' : 'light'}`}
            attribution={tileConfig.attribution}
            url={tileConfig.url}
            tileSize={tileConfig.tileSize}
            zoomOffset={tileConfig.zoomOffset}
            maxZoom={19}
          />

          {/* Radius Circle from Active Rig */}
          <Circle
            center={[centerLat, centerLng]}
            radius={radiusKm * 1000}
            pathOptions={{
              color: isDarkMode ? '#3FC3B6' : '#26A69A',
              fillColor: '#3FC3B6',
              fillOpacity: isDarkMode ? 0.08 : 0.06,
              weight: 1.5,
              dashArray: '5, 5'
            }}
          />

          {/* Dynamic Ray Connecting Center Well to the #1 Ranked Offset Well */}
          {topRankedOffset && (
            <>
              <Polyline
                positions={[
                  [centerLat, centerLng],
                  [topRankedOffset.well.coordinates.surfaceLat, topRankedOffset.well.coordinates.surfaceLng]
                ]}
                pathOptions={{
                  color: sortBy === 'similarity' ? '#3FC3B6' : '#F59E0B',
                  weight: 3,
                  dashArray: sortBy === 'similarity' ? '8, 6' : '4, 4',
                  opacity: 0.95
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 text-xs font-mono bg-white dark:bg-[#242D3B] text-[#252B33] dark:text-white">
                    <span className="font-bold text-[#26A69A] dark:text-[#3FC3B6]">
                      {sortBy === 'similarity' ? '🏆 #1 Stratigraphic Analog' : '📍 #1 Closest Offset Well'}
                    </span>
                    <div className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">
                      {topRankedOffset.well.name} ({topRankedOffset.distanceKm} km · {Math.round(topRankedOffset.similarity.total * 100)}% match)
                    </div>
                  </div>
                </Popup>
              </Polyline>

              {/* Pulsing Target Ring around #1 Ranked Well */}
              <CircleMarker
                center={[topRankedOffset.well.coordinates.surfaceLat, topRankedOffset.well.coordinates.surfaceLng]}
                radius={16}
                pathOptions={{
                  color: sortBy === 'similarity' ? '#3FC3B6' : '#F59E0B',
                  fillColor: sortBy === 'similarity' ? '#3FC3B6' : '#F59E0B',
                  fillOpacity: 0.2,
                  weight: 2,
                  dashArray: '3, 3'
                }}
              />
            </>
          )}

          {/* Offset Well Markers */}
          {wellsWithMetrics.map(({ well, distanceKm, similarity, inRadius }) => {
            const isCenter = well.id === centerWell.id;
            const rankIndex = sortedWells.findIndex((s) => s.well.id === well.id);
            const isTopRanked = rankIndex === 0;
            const markerColor = isCenter
              ? (isDarkMode ? '#ED1C24' : '#ED1C24')
              : isTopRanked
              ? (sortBy === 'similarity' ? '#3FC3B6' : '#F59E0B')
              : getMarkerColor(well);

            return (
              <CircleMarker
                key={well.id}
                center={[well.coordinates.surfaceLat, well.coordinates.surfaceLng]}
                radius={isCenter ? 12 : isTopRanked ? 10 : inRadius ? 8 : 6}
                pathOptions={{
                  color: isCenter
                    ? (isDarkMode ? '#FFFFFF' : '#0F172A')
                    : isTopRanked
                    ? (isDarkMode ? '#FFFFFF' : '#0F172A')
                    : markerColor,
                  fillColor: markerColor,
                  fillOpacity: isCenter ? 1 : isTopRanked ? 1 : inRadius ? 0.9 : 0.5,
                  weight: isCenter ? 3 : isTopRanked ? 2.5 : 1.5
                }}
                eventHandlers={{
                  click: () => setSelectedWell(well)
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-3 text-xs font-mono bg-white dark:bg-[#242D3B] text-[#252B33] dark:text-white rounded-none min-w-[210px] space-y-2 border border-[#E2E5E8] dark:border-[#364356] shadow-lg">
                    <div className="font-bold flex items-center justify-between gap-2 border-b border-[#E2E5E8] dark:border-[#364356] pb-1.5">
                      <div className="flex items-center gap-1.5">
                        {rankIndex >= 0 && (
                          <span className={`px-1.5 py-0.2 rounded-none text-[10px] font-bold ${
                            isTopRanked
                              ? (sortBy === 'similarity' ? 'bg-[#26A69A] text-white' : 'bg-[#F59E0B] text-black')
                              : 'bg-[#34435A] text-white'
                          }`}>
                            #{rankIndex + 1}
                          </span>
                        )}
                        <span className="text-sm font-extrabold text-[#26A69A] dark:text-[#3FC3B6]">{well.name}</span>
                      </div>
                      <StatusBadge status={well.status} size="sm" />
                    </div>

                    <div className="text-[#6B7280] dark:text-[#94A3B8] text-[11px]">
                      {well.field} Field · Block {well.block}
                    </div>

                    <div className="p-2 rounded-none bg-[#F5F7F8] dark:bg-[#1E2532] border border-[#E2E5E8] dark:border-[#364356] space-y-1 text-[11px]">
                      <div className="text-[#6B7280] dark:text-[#94A3B8] text-[10px] uppercase font-bold">Surface Coords:</div>
                      <div className="text-[#252B33] dark:text-white font-bold">
                        {formatCoords(well.coordinates.surfaceLat, well.coordinates.surfaceLng, coordFormat)}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(formatCoords(well.coordinates.surfaceLat, well.coordinates.surfaceLng, coordFormat), `popup-${well.id}`)}
                        className="mt-1 w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded-none bg-[#D9F2EE] dark:bg-[#34435A] hover:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border border-[#3FC3B6] text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        {copiedId === `popup-${well.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-[#3FAE68]" />
                            <span>COPIED!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>COPY COORDINATES</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-[#E2E5E8] dark:border-[#364356]">
                      <div>
                        <span className="text-[#6B7280] dark:text-[#94A3B8] block">DISTANCE</span>
                        <span className="font-bold text-[#26A69A] dark:text-[#3FC3B6]">{distanceKm} km</span>
                      </div>
                      <div>
                        <span className="text-[#6B7280] dark:text-[#94A3B8] block">SIMILARITY</span>
                        <span className="font-bold text-[#3FAE68]">
                          {Math.round(similarity.total * 100)}%
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/wells/${well.id}`}
                      className="mt-2 block text-center py-1.5 bg-[#34435A] hover:bg-[#2b394f] text-white rounded-none font-bold transition-colors"
                    >
                      View Well Details
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* Custom Coordinate Pins on Map */}
          {customPins.map((pin) => {
            const distFromCenter = Math.round(
              haversineDistance(centerLat, centerLng, pin.lat, pin.lng) * 10
            ) / 10;

            return (
              <React.Fragment key={pin.id}>
                {/* Baseline Connecting Custom Pin to Active Well */}
                <Polyline
                  positions={[
                    [centerLat, centerLng],
                    [pin.lat, pin.lng]
                  ]}
                  pathOptions={{
                    color: pin.color,
                    weight: 2,
                    dashArray: '4, 6',
                    opacity: 0.75
                  }}
                />

                {/* Outer Pulsing Halo */}
                <CircleMarker
                  center={[pin.lat, pin.lng]}
                  radius={14}
                  pathOptions={{
                    color: pin.color,
                    fillColor: pin.color,
                    fillOpacity: 0.25,
                    weight: 1.5
                  }}
                />

                {/* Inner Pin Marker */}
                <CircleMarker
                  center={[pin.lat, pin.lng]}
                  radius={7}
                  pathOptions={{
                    color: isDarkMode ? '#FFFFFF' : '#1E293B',
                    fillColor: pin.color,
                    fillOpacity: 1,
                    weight: 2.5
                  }}
                >
                  <Popup className="custom-popup">
                    <div className="p-3 text-xs font-mono bg-white dark:bg-[#242D3B] text-[#252B33] dark:text-white rounded-none min-w-[220px] space-y-2 border border-[#E2E5E8] dark:border-[#364356] shadow-md">
                      <div className="flex items-center justify-between pb-1.5 border-b border-[#E2E5E8] dark:border-[#364356]">
                        <div className="flex items-center gap-1.5 font-bold text-[#26A69A] dark:text-[#3FC3B6]">
                          <MapPin className="w-3.5 h-3.5" style={{ color: pin.color }} />
                          <span>{pin.name}</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-none bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] font-bold border border-[#3FC3B6]">
                          CUSTOM PIN
                        </span>
                      </div>

                      <div className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] space-y-0.5">
                        {pin.formation && <div>Fm: <strong className="text-[#252B33] dark:text-white">{pin.formation}</strong></div>}
                        {pin.depthMD && <div>Planned Depth: <strong className="text-[#252B33] dark:text-white">{pin.depthMD}m MD</strong></div>}
                        <div>Distance from {centerWell.name}: <strong className="text-[#26A69A] dark:text-[#3FC3B6]">{distFromCenter} km</strong></div>
                      </div>

                      <div className="p-2 rounded-none bg-[#F5F7F8] dark:bg-[#1E2532] border border-[#E2E5E8] dark:border-[#364356] space-y-1 text-[11px]">
                        <div className="text-[#6B7280] dark:text-[#94A3B8] text-[10px] uppercase font-bold">Coordinates:</div>
                        <div className="text-[#252B33] dark:text-white font-bold truncate">
                          {formatCoords(pin.lat, pin.lng, coordFormat)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(formatCoords(pin.lat, pin.lng, coordFormat), `popup-${pin.id}`)}
                          className="mt-1 w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded-none bg-[#3FC3B6] hover:bg-[#26A69A] text-[#222222] text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          {copiedId === `popup-${pin.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-[#222222]" />
                              <span>COPIED!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>COPY COORDINATES</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeletePin(pin.id)}
                        className="w-full flex items-center justify-center gap-1 text-[10px] text-[#E05252] hover:text-[#ED1C24] py-1 rounded-none border border-[#E05252]/40 hover:bg-[#FDF2F2] dark:hover:bg-[#ED1C24]/15 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Pin</span>
                      </button>
                    </div>
                  </Popup>
                </CircleMarker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend (Adaptive Light/Dark Theme) */}
        <div className="absolute bottom-4 left-4 z-20 rounded-none bg-white/95 dark:bg-[#242D3B]/95 backdrop-blur-md border border-[#E2E5E8] dark:border-[#364356] p-3 text-xs font-mono space-y-2 shadow-xs max-w-[220px]">
          <div className="text-[10px] font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider flex items-center justify-between">
            <span>Map Layers</span>
            <span className="text-[9px] text-[#26A69A] dark:text-[#3FC3B6] font-bold">{radiusKm}km radius</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-none bg-[#ED1C24] border border-[#222222]" />
              <span className="text-[#252B33] dark:text-white font-bold">Active Rig ({centerWell.name})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-none bg-[#3FAE68]" />
              <span className="text-[#6B7280] dark:text-[#94A3B8]">Drilling Offset</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-none bg-[#26A69A]" />
              <span className="text-[#6B7280] dark:text-[#94A3B8]">Completed Well</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-none bg-[#F2B84B]" />
              <span className="text-[#6B7280] dark:text-[#94A3B8]">Custom Pin</span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── DEDICATED SIDEBAR PANEL WITH TABS (Matches Page Theme) ─── */}
      <div className="w-full xl:w-[420px] flex flex-col h-[600px] xl:h-full max-h-[640px] min-h-0 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#242D3B] p-4 shadow-2xs overflow-hidden shrink-0 transition-colors">
        
        {/* ── Tab Switcher Header ── */}
        <div className="flex items-center rounded-none bg-[#F5F7F8] dark:bg-[#1E2532] p-1 border border-[#E2E5E8] dark:border-[#364356] mb-3.5">
          <button
            type="button"
            onClick={() => setSidebarTab('coordinates')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-none text-xs font-mono font-bold transition-all cursor-pointer ${
              sidebarTab === 'coordinates'
                ? 'bg-[#34435A] text-white shadow-xs border-b-2 border-b-[#3FC3B6]'
                : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
            }`}
          >
            <MapPin className={`w-3.5 h-3.5 ${sidebarTab === 'coordinates' ? 'text-[#3FC3B6]' : 'text-[#6B7280]'}`} />
            <span>Custom Coordinates</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-none font-bold ${
              sidebarTab === 'coordinates' ? 'bg-[#26A69A] text-white' : 'bg-[#E2E5E8] dark:bg-[#34435A] text-[#6B7280] dark:text-white'
            }`}>
              {customPins.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSidebarTab('offsets')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-none text-xs font-mono font-bold transition-all cursor-pointer ${
              sidebarTab === 'offsets'
                ? 'bg-[#34435A] text-white shadow-xs border-b-2 border-b-[#3FC3B6]'
                : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${sidebarTab === 'offsets' ? 'text-[#3FC3B6]' : 'text-[#6B7280]'}`} />
            <span>Offset Analogs</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-none font-bold ${
              sidebarTab === 'offsets' ? 'bg-[#26A69A] text-white' : 'bg-[#E2E5E8] dark:bg-[#34435A] text-[#6B7280] dark:text-white'
            }`}>
              {sortedWells.length}
            </span>
          </button>
        </div>

        {/* ── Coordinate Format Selector & Global Actions ── */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E5E8] dark:border-[#364356] text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-[#6B7280] dark:text-[#94A3B8] text-[11px]">Format:</span>
            <div className="inline-flex rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] p-0.5">
              <button
                type="button"
                onClick={() => setCoordFormat('DD')}
                className={`px-2 py-0.5 rounded-none text-[10px] font-bold cursor-pointer transition-colors ${
                  coordFormat === 'DD'
                    ? 'bg-[#34435A] text-white'
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
                }`}
                title="Decimal Degrees (e.g. 26.912400, 94.634100)"
              >
                DD
              </button>
              <button
                type="button"
                onClick={() => setCoordFormat('DMS')}
                className={`px-2 py-0.5 rounded-none text-[10px] font-bold cursor-pointer transition-colors ${
                  coordFormat === 'DMS'
                    ? 'bg-[#34435A] text-white'
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#252B33] dark:hover:text-white'
                }`}
                title="Degrees Minutes Seconds (e.g. 26°54'44.6&quot;N 94°38'02.8&quot;E)"
              >
                DMS
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyAllCoordinates}
            className="flex items-center gap-1 text-[11px] text-[#26A69A] dark:text-[#3FC3B6] hover:text-[#3FC3B6] font-bold cursor-pointer transition-colors"
            title="Copy all active, custom, and offset coordinates"
          >
            {copiedId === 'copy-all-batch' ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3FAE68]" />
                <span className="text-[#3FAE68]">All Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Export / Copy All</span>
              </>
            )}
          </button>
        </div>

        {/* ── Active Well Surface Coordinates Card (Theme-Matched) ── */}
        <div className="mb-3.5 p-3 rounded-none border border-[#3FC3B6] bg-[#D9F2EE]/40 dark:bg-[#3FC3B6]/15 text-xs font-mono space-y-1.5 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-none bg-[#ED1C24] animate-pulse" />
              <span className="text-[#6B7280] dark:text-[#94A3B8] text-[10px] uppercase font-bold">Active Well Center</span>
            </div>
            <span className="text-[#26A69A] dark:text-[#3FC3B6] font-bold text-xs">{centerWell.name}</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="text-[#252B33] dark:text-white font-bold truncate text-[11px]">
              {formatCoords(centerLat, centerLng, coordFormat)}
            </div>

            <button
              type="button"
              onClick={() => handleCopy(formatCoords(centerLat, centerLng, coordFormat), `active-${centerWell.id}`)}
              className="flex items-center gap-1 px-2 py-1 rounded-none bg-[#34435A] hover:bg-[#222222] border border-[#34435A] text-white text-[10px] font-bold cursor-pointer transition-all shrink-0"
              title="Copy active well coordinates"
            >
              {copiedId === `active-${centerWell.id}` ? (
                <>
                  <Check className="w-3 h-3 text-[#3FAE68]" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ════════ TAB 1: CUSTOM COORDINATES (Theme-Matched) ════════ */}
        {sidebarTab === 'coordinates' && (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-[#364356] scroll-smooth">
            
            {/* Add Custom Coordinate Form (Theme-Matched) */}
            <form onSubmit={handleAddPin} className="p-3.5 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-[#F5F7F8] dark:bg-[#1E2532] space-y-3 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#252B33] dark:text-white font-mono flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#3FC3B6]" />
                  Add Custom Coordinate
                </span>

                {/* Interactive Click-to-Pick on Map Button */}
                <button
                  type="button"
                  onClick={() => setIsPickingLocation(!isPickingLocation)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-none text-[10px] font-mono font-bold cursor-pointer transition-all ${
                    isPickingLocation
                      ? 'bg-[#34435A] text-white border border-[#3FC3B6] animate-pulse shadow-sm'
                      : 'bg-white dark:bg-[#242D3B] hover:bg-[#F5F7F8] dark:hover:bg-[#1E2532] text-[#252B33] dark:text-white border border-[#E2E5E8] dark:border-[#364356] shadow-2xs'
                  }`}
                  title="Click map to capture latitude and longitude"
                >
                  <Crosshair className="w-3.5 h-3.5 text-[#3FC3B6]" />
                  <span>{isPickingLocation ? 'Picking...' : 'Pick on Map'}</span>
                </button>
              </div>

              {formError && (
                <div className="p-2 rounded-none bg-[#FDF2F2] dark:bg-[#ED1C24]/15 border border-[#E05252] text-[#ED1C24] text-[11px] font-mono">
                  {formError}
                </div>
              )}

              {/* Point Name Input */}
              <div>
                <label className="text-[10px] font-mono font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase block mb-1">
                  Target / Pin Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Relief Well Pad B, Sidetrack GLK-14-ST"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] rounded-none px-2.5 py-1.5 text-xs font-mono text-[#252B33] dark:text-white placeholder-[#6B7280] dark:placeholder-[#94A3B8] focus:border-[#3FC3B6] focus:outline-hidden"
                />
              </div>

              {/* Lat and Lng Dual Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase block mb-1">
                    Latitude (°N)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="26.912400"
                    value={inputLat}
                    onChange={(e) => setInputLat(e.target.value)}
                    className="w-full bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] rounded-none px-2 py-1.5 text-xs font-mono text-[#252B33] dark:text-white placeholder-[#6B7280] dark:placeholder-[#94A3B8] focus:border-[#3FC3B6] focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase block mb-1">
                    Longitude (°E)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="94.634100"
                    value={inputLng}
                    onChange={(e) => setInputLng(e.target.value)}
                    className="w-full bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] rounded-none px-2 py-1.5 text-xs font-mono text-[#252B33] dark:text-white placeholder-[#6B7280] dark:placeholder-[#94A3B8] focus:border-[#3FC3B6] focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Formation & Depth Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase block mb-1">
                    Formation (Opt)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tipam SS"
                    value={inputFormation}
                    onChange={(e) => setInputFormation(e.target.value)}
                    className="w-full bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] rounded-none px-2 py-1.5 text-xs font-mono text-[#252B33] dark:text-white placeholder-[#6B7280] dark:placeholder-[#94A3B8] focus:border-[#3FC3B6] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase block mb-1">
                    Depth MD (m)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2350"
                    value={inputDepth}
                    onChange={(e) => setInputDepth(e.target.value)}
                    className="w-full bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] rounded-none px-2 py-1.5 text-xs font-mono text-[#252B33] dark:text-white placeholder-[#6B7280] dark:placeholder-[#94A3B8] focus:border-[#3FC3B6] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Pin Color Selector */}
              <div>
                <label className="text-[10px] font-mono font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase block mb-1">
                  Pin Marker Color
                </label>
                <div className="flex items-center gap-2">
                  {['#F2B84B', '#3FC3B6', '#3FAE68', '#ED1C24', '#34435A', '#26A69A'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setInputColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-none transition-transform cursor-pointer ${
                        inputColor === color ? 'scale-125 ring-2 ring-[#222222] shadow-sm' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-none bg-[#ED1C24] hover:bg-[#C9141B] text-white font-bold font-mono text-xs cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Plot Pin on Map</span>
              </button>
            </form>

            {/* Quick Regional & Pan-India Basin Presets */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider">
                Seven Sisters & National Basin Presets
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ASSAM_BASIN_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-[10px] font-mono px-2 py-1 rounded-none bg-white hover:bg-[#F5F7F8] dark:bg-[#1E2532] border border-[#E2E5E8] dark:border-[#364356] text-[#252B33] dark:text-white hover:text-[#26A69A] cursor-pointer transition-colors shadow-2xs"
                  >
                    + {preset.name.split(' (')[0]} ({preset.depthMD}m)
                  </button>
                ))}
              </div>
            </div>

            {/* Plotted Pins Register (Theme-Matched) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider">
                <span>Plotted Custom Pins ({customPins.length})</span>
                <span className="text-[#6B7280] dark:text-[#94A3B8]">Click to Zoom</span>
              </div>

              {customPins.length === 0 ? (
                <div className="p-4 rounded-none border border-dashed border-[#E2E5E8] dark:border-[#364356] text-center text-xs font-mono text-[#6B7280] dark:text-[#94A3B8]">
                  No custom coordinates added yet. Use the form above or click &quot;Pick on Map&quot;.
                </div>
              ) : (
                <div className="space-y-2">
                  {customPins.map((pin) => {
                    const distFromCenter = Math.round(
                      haversineDistance(centerLat, centerLng, pin.lat, pin.lng) * 10
                    ) / 10;

                    return (
                      <div
                        key={pin.id}
                        className="p-3 rounded-none border border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#1E2532] hover:border-[#34435A] transition-all text-xs font-mono space-y-2 group shadow-2xs"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2.5 h-2.5 rounded-none shrink-0" 
                              style={{ backgroundColor: pin.color }} 
                            />
                            <div>
                              <div className="font-bold text-[#252B33] dark:text-white">{pin.name}</div>
                              <div className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">
                                {pin.formation || 'Subsurface Target'} {pin.depthMD ? `· ${pin.depthMD}m MD` : ''}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setZoomTarget([pin.lat, pin.lng])}
                              className="p-1 rounded-none text-[#6B7280] dark:text-[#94A3B8] hover:text-[#26A69A] hover:bg-[#F5F7F8] dark:hover:bg-[#242D3B] cursor-pointer"
                              title="Zoom to pin location on map"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePin(pin.id)}
                              className="p-1 rounded-none text-[#6B7280] dark:text-[#94A3B8] hover:text-[#ED1C24] hover:bg-[#FDF2F2] dark:hover:bg-[#ED1C24]/15 cursor-pointer"
                              title="Delete pin"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="p-2 rounded-none bg-[#F5F7F8] dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] flex items-center justify-between gap-2">
                          <span className="text-[11px] text-[#252B33] dark:text-white font-bold truncate">
                            {formatCoords(pin.lat, pin.lng, coordFormat)}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleCopy(formatCoords(pin.lat, pin.lng, coordFormat), pin.id)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-none bg-[#D9F2EE] dark:bg-[#34435A] hover:bg-[#3FC3B6]/20 text-[#26A69A] dark:text-[#3FC3B6] border border-[#3FC3B6] text-[10px] font-bold cursor-pointer transition-colors shrink-0"
                            title="Copy coordinates"
                          >
                            {copiedId === pin.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#3FAE68]" />
                                <span className="text-[#3FAE68]">COPIED</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>COPY</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] flex items-center justify-between">
                          <span className="text-[#26A69A] dark:text-[#3FC3B6] font-bold">
                            {distFromCenter} km from {centerWell.name}
                          </span>
                          <span className="text-[#6B7280] dark:text-[#94A3B8] font-mono">
                            {pin.lat.toFixed(4)}°, {pin.lng.toFixed(4)}°
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ════════ TAB 2: OFFSET ANALOGS (Theme-Matched with Dynamic Ranking) ════════ */}
        {sidebarTab === 'offsets' && (
          <div className="flex-1 min-h-0 flex flex-col">
            
            {/* ── Active Ranking Explainer Banner ── */}
            <div className={`p-2.5 rounded-none border text-xs font-mono mb-2.5 transition-colors ${
              sortBy === 'similarity'
                ? 'bg-[#D9F2EE]/60 dark:bg-[#3FC3B6]/15 border-[#3FC3B6] text-[#252B33] dark:text-white'
                : 'bg-[#FEF3C7]/70 dark:bg-[#F59E0B]/15 border-[#F59E0B] text-[#252B33] dark:text-white'
            }`}>
              <div className="flex items-center justify-between font-bold text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  {sortBy === 'similarity' ? (
                    <>
                      <Compass className="w-3.5 h-3.5 text-[#26A69A] dark:text-[#3FC3B6]" />
                      <span className="text-[#26A69A] dark:text-[#3FC3B6] uppercase">Stratigraphic Similarity Mode</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-[#D97706] dark:text-[#F59E0B]" />
                      <span className="text-[#D97706] dark:text-[#F59E0B] uppercase">Geographic Distance Mode</span>
                    </>
                  )}
                </div>
                {topRankedOffset && (
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-none ${
                    sortBy === 'similarity'
                      ? 'bg-[#26A69A] text-white'
                      : 'bg-[#F59E0B] text-black'
                  }`}>
                    #1: {topRankedOffset.well.name}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#6B7280] dark:text-[#CBD5E1] leading-relaxed">
                {sortBy === 'similarity'
                  ? 'Ranked by formation, lithology, and pore-pressure correlation. Avoids the Proximity Trap (closest well is not always the best analog).'
                  : 'Ranked strictly by radial Euclidean surface coordinate distance from active well center.'}
              </p>
            </div>

            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E5E8] dark:border-[#364356] text-[11px] font-mono">
              <span className="text-[#6B7280] dark:text-[#94A3B8]">
                {sortBy === 'distance' ? 'Sorted: Nearest First' : 'Sorted: Best Correlation First'}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#26A69A] dark:text-[#3FC3B6] font-bold bg-[#D9F2EE] dark:bg-[#3FC3B6]/20 px-2 py-0.5 rounded-none border border-[#3FC3B6]">
                <ArrowUpDown className="w-3 h-3" />
                {sortedWells.length} Offset Analogs
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scroll-smooth">

            {sortedWells.map(({ well, distanceKm, similarity, inRadius }, idx) => {
              const isTop = idx === 0;
              const simPct = Math.round(similarity.total * 100);
              const formattedWellCoords = formatCoords(well.coordinates.surfaceLat, well.coordinates.surfaceLng, coordFormat);

              return (
                <div
                  key={well.id}
                  onClick={() => {
                    setSelectedWell(well);
                    setZoomTarget([well.coordinates.surfaceLat, well.coordinates.surfaceLng]);
                  }}
                  className={`p-3 rounded-none border transition cursor-pointer text-xs font-mono space-y-2 shadow-2xs ${
                    selectedWell?.id === well.id
                      ? 'border-[#3FC3B6] bg-[#D9F2EE]/40 dark:bg-[#3FC3B6]/15 ring-1 ring-[#3FC3B6]'
                      : isTop
                      ? (sortBy === 'similarity'
                          ? 'border-[#26A69A] dark:border-[#3FC3B6] bg-[#D9F2EE]/25 dark:bg-[#3FC3B6]/10'
                          : 'border-[#F59E0B] dark:border-[#F59E0B] bg-[#FEF3C7]/30 dark:bg-[#F59E0B]/10')
                      : inRadius
                      ? 'border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#1E2532] hover:border-[#34435A]'
                      : 'border-[#E2E5E8]/60 dark:border-[#364356]/60 bg-[#F5F7F8] dark:bg-[#191E26] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-1.5 py-0.2 rounded-none text-[10px] font-bold font-mono ${
                          isTop
                            ? (sortBy === 'similarity' ? 'bg-[#26A69A] text-white' : 'bg-[#F59E0B] text-black')
                            : 'bg-[#34435A] text-white'
                        }`}>
                          #{idx + 1} {isTop ? (sortBy === 'similarity' ? '★ TOP ANALOG' : '★ CLOSEST') : ''}
                        </span>
                        <span className="font-bold text-[#252B33] dark:text-white">{well.name}</span>
                        <StatusBadge status={well.status} size="sm" />
                      </div>
                      <div className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5">
                        {well.field} · {well.totalDepthMD}m TD
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(formattedWellCoords, `well-${well.id}`);
                        }}
                        className="p-1.5 rounded-none bg-[#F5F7F8] dark:bg-[#242D3B] hover:bg-[#E2E5E8] dark:hover:bg-[#34435A] text-[#252B33] dark:text-white cursor-pointer"
                        title="Copy well coordinates"
                      >
                        {copiedId === `well-${well.id}` ? (
                          <Check className="w-3.5 h-3.5 text-[#3FAE68]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <Link
                        href={`/wells/${well.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-none text-[#6B7280] dark:text-[#94A3B8] hover:text-[#3FC3B6]"
                        title="Open Well Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Surface Coordinates Row with Quick Copy Feedback */}
                  <div className="text-[10px] text-[#6B7280] dark:text-[#94A3B8] flex items-center justify-between bg-[#F5F7F8] dark:bg-[#242D3B] px-2 py-1 rounded-none border border-[#E2E5E8] dark:border-[#364356]">
                    <span className="truncate">{formattedWellCoords}</span>
                    {copiedId === `well-${well.id}` && (
                      <span className="text-[9px] text-[#3FAE68] font-bold ml-1 shrink-0">COPIED</span>
                    )}
                  </div>

                  {/* Prominent Primary Metric based on active Sort Mode */}
                  <div className="pt-2 border-t border-[#E2E5E8] dark:border-[#364356] grid grid-cols-2 gap-2 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${
                      sortBy === 'distance'
                        ? 'font-extrabold text-[#D97706] dark:text-[#F59E0B]'
                        : 'text-[#252B33] dark:text-white'
                    }`}>
                      <MapPin className={`w-3.5 h-3.5 shrink-0 ${sortBy === 'distance' ? 'text-[#F59E0B]' : 'text-[#26A69A] dark:text-[#3FC3B6]'}`} />
                      <span>{distanceKm} km dist</span>
                    </div>

                    <div className={`flex items-center justify-end gap-1.5 ${
                      sortBy === 'similarity'
                        ? 'font-extrabold text-[#26A69A] dark:text-[#3FC3B6]'
                        : 'font-bold'
                    }`}>
                      <Compass className={`w-3.5 h-3.5 shrink-0 ${sortBy === 'similarity' ? 'text-[#3FC3B6]' : 'text-[#6B7280]'}`} />
                      <span className={simPct >= 70 ? 'text-[#3FAE68]' : 'text-[#F2B84B]'}>
                        {simPct}% sim
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
