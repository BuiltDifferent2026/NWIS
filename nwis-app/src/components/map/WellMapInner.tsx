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
  Share2
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
}

// ─── Preset Reference Locations in Assam-Arakan Basin ───
const ASSAM_BASIN_PRESETS = [
  {
    name: 'Geleki South Relief Pad',
    lat: 26.9280,
    lng: 94.6520,
    formation: 'Tipam Sandstone',
    depthMD: 2350,
    color: '#F59E0B'
  },
  {
    name: 'Digboi Historical Discovery',
    lat: 27.3800,
    lng: 95.6300,
    formation: 'Bhuban Member',
    depthMD: 1820,
    color: '#10B981'
  },
  {
    name: 'Rudrasagar Step-Out 04',
    lat: 26.9800,
    lng: 94.5700,
    formation: 'Barail Transition',
    depthMD: 3100,
    color: '#8B5CF6'
  },
  {
    name: 'Lakwa East Cluster',
    lat: 27.0200,
    lng: 94.8600,
    formation: 'Tipam Member-B',
    depthMD: 2650,
    color: '#06B6D4'
  },
  {
    name: 'Kharsang Pad-04',
    lat: 27.2700,
    lng: 95.9300,
    formation: 'Girujan Clay Cap',
    depthMD: 1950,
    color: '#F43F5E'
  }
];

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
  zoomTarget
}: {
  isPicking: boolean;
  onPick: (lat: number, lng: number) => void;
  zoomTarget: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (zoomTarget) {
      map.flyTo(zoomTarget, 12, { duration: 1.2 });
    }
  }, [zoomTarget, map]);

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
  sortBy
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
  
  // Dedicated Tab State in Sidebar: 'offsets' vs 'coordinates'
  const [sidebarTab, setSidebarTab] = useState<'offsets' | 'coordinates'>('coordinates');
  
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

  // Sort by chosen metric
  const sortedWells = [...wellsWithMetrics].sort((a, b) => {
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    return b.similarity.total - a.similarity.total;
  });

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
      `=== ASSAM BASIN GEOSPATIAL COORDINATES REGISTER ===`,
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
    if (well.id === centerWell.id) return '#0284C7'; // Cyan/Sky for active rig
    if (well.status === 'drilling') return '#059669'; // Emerald
    if (well.status === 'completed') return '#2563EB'; // Blue
    if (well.status === 'suspended') return '#D97706'; // Amber
    return '#64748B';
  };

  return (
    <div className="relative flex flex-col xl:flex-row h-full w-full gap-4 min-h-[580px]">
      
      {/* ─── Map Viewport (Matches Page Theme) ─── */}
      <div className={`flex-1 relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-[#090c12] min-h-[480px] shadow-xs ${
        isPickingLocation ? 'cursor-crosshair ring-2 ring-amber-500' : ''
      }`}>
        
        {/* Picking Location Floating Guidance Banner */}
        {isPickingLocation && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-amber-500 text-neutral-950 px-4 py-2 rounded-xl font-mono text-xs font-bold shadow-xl flex items-center gap-3 animate-bounce">
            <Crosshair className="w-4 h-4 animate-spin" />
            <span>CLICK ANYWHERE ON THE MAP TO CAPTURE COORDINATES</span>
            <button
              type="button"
              onClick={() => setIsPickingLocation(false)}
              className="ml-2 bg-neutral-950/20 hover:bg-neutral-950/40 p-1 rounded text-neutral-950 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <MapContainer
          center={[centerLat, centerLng]}
          zoom={10}
          scrollWheelZoom={true}
          className="h-full w-full z-10"
          style={{ background: isDarkMode ? '#090C12' : '#E2E8F0' }}
        >
          {/* Map interactive handler for clicks and programmatic zooming */}
          <MapInteractiveController
            isPicking={isPickingLocation}
            onPick={handleMapPick}
            zoomTarget={zoomTarget}
          />

          {/* Theme-Adaptive Tile Layer: Crisp Light Voyager in Light Mode, Carto Dark in Dark Mode */}
          <TileLayer
            key={isDarkMode ? 'dark-tiles' : 'light-tiles'}
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url={
              isDarkMode
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
            }
          />

          {/* Radius Circle from Active Rig */}
          <Circle
            center={[centerLat, centerLng]}
            radius={radiusKm * 1000}
            pathOptions={{
              color: isDarkMode ? '#3B82F6' : '#2563EB',
              fillColor: isDarkMode ? '#3B82F6' : '#3B82F6',
              fillOpacity: isDarkMode ? 0.08 : 0.06,
              weight: 1.5,
              dashArray: '5, 5'
            }}
          />

          {/* Offset Well Markers */}
          {wellsWithMetrics.map(({ well, distanceKm, similarity, inRadius }) => {
            const isCenter = well.id === centerWell.id;
            const markerColor = getMarkerColor(well);

            return (
              <CircleMarker
                key={well.id}
                center={[well.coordinates.surfaceLat, well.coordinates.surfaceLng]}
                radius={isCenter ? 12 : inRadius ? 8 : 6}
                pathOptions={{
                  color: isCenter ? (isDarkMode ? '#FFFFFF' : '#0F172A') : markerColor,
                  fillColor: markerColor,
                  fillOpacity: isCenter ? 1 : inRadius ? 0.9 : 0.5,
                  weight: isCenter ? 3 : 1.5
                }}
                eventHandlers={{
                  click: () => setSelectedWell(well)
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-3 text-xs font-mono bg-white dark:bg-slate-900 text-neutral-900 dark:text-slate-100 rounded-lg min-w-[210px] space-y-2 border border-neutral-200 dark:border-slate-800 shadow-lg">
                    <div className="font-bold flex items-center justify-between gap-2 border-b border-neutral-200 dark:border-slate-800 pb-1.5">
                      <span className="text-sm font-extrabold text-blue-600 dark:text-cyan-400">{well.name}</span>
                      <StatusBadge status={well.status} size="sm" />
                    </div>

                    <div className="text-neutral-600 dark:text-slate-300 text-[11px]">
                      {well.field} Field · Block {well.block}
                    </div>

                    <div className="p-2 rounded bg-neutral-50 dark:bg-slate-950/80 border border-neutral-200 dark:border-slate-800 space-y-1 text-[11px]">
                      <div className="text-neutral-500 dark:text-slate-400 text-[10px] uppercase font-bold">Surface Coords:</div>
                      <div className="text-neutral-900 dark:text-slate-200 font-bold">
                        {formatCoords(well.coordinates.surfaceLat, well.coordinates.surfaceLng, coordFormat)}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(formatCoords(well.coordinates.surfaceLat, well.coordinates.surfaceLng, coordFormat), `popup-${well.id}`)}
                        className="mt-1 w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded bg-neutral-200 hover:bg-neutral-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-neutral-900 dark:text-cyan-300 text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        {copiedId === `popup-${well.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
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

                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-neutral-200 dark:border-slate-800">
                      <div>
                        <span className="text-neutral-500 dark:text-slate-400 block">DISTANCE</span>
                        <span className="font-bold text-blue-600 dark:text-cyan-400">{distanceKm} km</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-slate-400 block">SIMILARITY</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {Math.round(similarity.total * 100)}%
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/wells/${well.id}`}
                      className="mt-2 block text-center py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors"
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
                    <div className="p-3 text-xs font-mono bg-white dark:bg-slate-900 text-neutral-900 dark:text-slate-100 rounded-lg min-w-[220px] space-y-2 border border-neutral-200 dark:border-slate-800 shadow-lg">
                      <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                          <MapPin className="w-3.5 h-3.5" style={{ color: pin.color }} />
                          <span>{pin.name}</span>
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-transparent">
                          CUSTOM PIN
                        </span>
                      </div>

                      <div className="text-[11px] text-neutral-600 dark:text-slate-300 space-y-0.5">
                        {pin.formation && <div>Fm: <strong className="text-neutral-900 dark:text-white">{pin.formation}</strong></div>}
                        {pin.depthMD && <div>Planned Depth: <strong className="text-neutral-900 dark:text-white">{pin.depthMD}m MD</strong></div>}
                        <div>Distance from {centerWell.name}: <strong className="text-blue-600 dark:text-cyan-400">{distFromCenter} km</strong></div>
                      </div>

                      <div className="p-2 rounded bg-neutral-50 dark:bg-slate-950/80 border border-neutral-200 dark:border-slate-800 space-y-1 text-[11px]">
                        <div className="text-neutral-500 dark:text-slate-400 text-[10px] uppercase font-bold">Coordinates:</div>
                        <div className="text-neutral-900 dark:text-slate-200 font-bold truncate">
                          {formatCoords(pin.lat, pin.lng, coordFormat)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(formatCoords(pin.lat, pin.lng, coordFormat), `popup-${pin.id}`)}
                          className="mt-1 w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded bg-amber-500 hover:bg-amber-600 text-neutral-950 text-[10px] font-bold cursor-pointer transition-colors"
                        >
                          {copiedId === `popup-${pin.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-neutral-950" />
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
                        className="w-full flex items-center justify-center gap-1 text-[10px] text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 py-1 rounded border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
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
        <div className="absolute bottom-4 left-4 z-20 rounded-xl bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border border-neutral-200 dark:border-slate-800 p-3 text-xs font-mono space-y-2 shadow-md max-w-[220px]">
          <div className="text-[10px] font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Map Layers</span>
            <span className="text-[9px] text-blue-600 dark:text-cyan-400 font-bold">{radiusKm}km radius</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-500 border border-neutral-900 dark:border-white" />
              <span className="text-neutral-800 dark:text-slate-200">Active Rig ({centerWell.name})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-neutral-700 dark:text-slate-300">Drilling Offset</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-neutral-700 dark:text-slate-300">Completed Well</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-neutral-700 dark:text-slate-300">Custom Pin</span>
            </div>
          </div>
        </div>

      </div>

      {/* ─── DEDICATED SIDEBAR PANEL WITH TABS (Matches Page Theme) ─── */}
      <div className="w-full lg:w-[410px] flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0c1017] p-4 shadow-sm dark:shadow-xl overflow-hidden shrink-0 transition-colors">
        
        {/* ── Tab Switcher Header ── */}
        <div className="flex items-center rounded-xl bg-neutral-100 dark:bg-neutral-900/90 p-1 border border-neutral-200 dark:border-neutral-800 mb-3.5">
          <button
            type="button"
            onClick={() => setSidebarTab('coordinates')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              sidebarTab === 'coordinates'
                ? 'bg-white dark:bg-amber-500 text-neutral-950 dark:text-neutral-950 shadow-xs border border-neutral-200/80 dark:border-transparent'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-neutral-950" />
            <span>Custom Coordinates</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              sidebarTab === 'coordinates' ? 'bg-neutral-100 dark:bg-neutral-950/20 text-neutral-900 dark:text-neutral-950' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}>
              {customPins.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSidebarTab('offsets')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              sidebarTab === 'offsets'
                ? 'bg-white dark:bg-amber-500 text-neutral-950 dark:text-neutral-950 shadow-xs border border-neutral-200/80 dark:border-transparent'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-neutral-950" />
            <span>Offset Analogs</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              sidebarTab === 'offsets' ? 'bg-neutral-100 dark:bg-neutral-950/20 text-neutral-900 dark:text-neutral-950' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}>
              {sortedWells.length}
            </span>
          </button>
        </div>

        {/* ── Coordinate Format Selector & Global Actions ── */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800/80 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">Format:</span>
            <div className="inline-flex rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/80 p-0.5">
              <button
                type="button"
                onClick={() => setCoordFormat('DD')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  coordFormat === 'DD'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Decimal Degrees (e.g. 26.912400, 94.634100)"
              >
                DD
              </button>
              <button
                type="button"
                onClick={() => setCoordFormat('DMS')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  coordFormat === 'DMS'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
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
            className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold cursor-pointer transition-colors"
            title="Copy all active, custom, and offset coordinates"
          >
            {copiedId === 'copy-all-batch' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">All Copied!</span>
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
        <div className="mb-3.5 p-3 rounded-xl border border-sky-200 dark:border-cyan-500/30 bg-sky-50/70 dark:bg-cyan-950/20 text-xs font-mono space-y-1.5 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-600 dark:bg-cyan-400 animate-pulse" />
              <span className="text-neutral-600 dark:text-slate-400 text-[10px] uppercase font-bold">Active Well Center</span>
            </div>
            <span className="text-sky-800 dark:text-cyan-300 font-bold text-xs">{centerWell.name}</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="text-neutral-900 dark:text-slate-200 font-bold truncate text-[11px]">
              {formatCoords(centerLat, centerLng, coordFormat)}
            </div>

            <button
              type="button"
              onClick={() => handleCopy(formatCoords(centerLat, centerLng, coordFormat), `active-${centerWell.id}`)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-sky-100 hover:bg-sky-200 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 border border-sky-300 dark:border-cyan-500/40 text-sky-900 dark:text-cyan-300 text-[10px] font-bold cursor-pointer transition-all shrink-0"
              title="Copy active well coordinates"
            >
              {copiedId === `active-${centerWell.id}` ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
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

        {/* ════════ TAB 1: CUSTOM COORDINATES & PINS WORKBENCH ════════ */}
        {sidebarTab === 'coordinates' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            
            {/* Add Custom Coordinate Form (Theme-Matched) */}
            <form onSubmit={handleAddPin} className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/70 space-y-3 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-slate-100 font-mono flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
                  Add Custom Coordinate
                </span>

                {/* Interactive Click-to-Pick on Map Button */}
                <button
                  type="button"
                  onClick={() => setIsPickingLocation(!isPickingLocation)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all ${
                    isPickingLocation
                      ? 'bg-amber-500 text-neutral-950 animate-pulse shadow-sm'
                      : 'bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-amber-400 border border-neutral-300 dark:border-neutral-700 shadow-2xs'
                  }`}
                  title="Click map to capture latitude and longitude"
                >
                  <Crosshair className="w-3 h-3" />
                  <span>{isPickingLocation ? 'Picking...' : 'Pick on Map'}</span>
                </button>
              </div>

              {formError && (
                <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-[11px] font-mono">
                  {formError}
                </div>
              )}

              {/* Point Name Input */}
              <div>
                <label className="text-[10px] font-mono font-bold text-neutral-600 dark:text-slate-400 uppercase block mb-1">
                  Target / Pin Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Relief Well Pad B, Sidetrack GLK-14-ST"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Lat and Lng Dual Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono font-bold text-neutral-600 dark:text-slate-400 uppercase block mb-1">
                    Latitude (°N)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="26.912400"
                    value={inputLat}
                    onChange={(e) => setInputLat(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg px-2 py-1.5 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-amber-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold text-neutral-600 dark:text-slate-400 uppercase block mb-1">
                    Longitude (°E)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="94.634100"
                    value={inputLng}
                    onChange={(e) => setInputLng(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg px-2 py-1.5 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-amber-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Formation & Depth Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono font-bold text-neutral-600 dark:text-slate-400 uppercase block mb-1">
                    Formation (Opt)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tipam SS"
                    value={inputFormation}
                    onChange={(e) => setInputFormation(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg px-2 py-1.5 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-bold text-neutral-600 dark:text-slate-400 uppercase block mb-1">
                    Depth MD (m)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2350"
                    value={inputDepth}
                    onChange={(e) => setInputDepth(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg px-2 py-1.5 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Pin Color Selector */}
              <div>
                <label className="text-[10px] font-mono font-bold text-neutral-600 dark:text-slate-400 uppercase block mb-1">
                  Pin Marker Color
                </label>
                <div className="flex items-center gap-2">
                  {['#F59E0B', '#06B6D4', '#10B981', '#F43F5E', '#8B5CF6', '#3B82F6'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setInputColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                        inputColor === color ? 'scale-125 ring-2 ring-neutral-900 dark:ring-white shadow-md' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500 hover:from-amber-700 hover:to-orange-700 text-white dark:text-neutral-950 font-bold font-mono text-xs cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Plot Pin on Map</span>
              </button>
            </form>

            {/* Quick Assam Basin Presets */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold text-neutral-600 dark:text-slate-400 uppercase tracking-wider">
                Assam Basin Field Presets
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ASSAM_BASIN_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-amber-700 dark:hover:text-amber-400 cursor-pointer transition-colors shadow-2xs"
                  >
                    + {preset.name.split(' ')[0]} ({preset.depthMD}m)
                  </button>
                ))}
              </div>
            </div>

            {/* Plotted Pins Register (Theme-Matched) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-neutral-600 dark:text-slate-400 uppercase tracking-wider">
                <span>Plotted Custom Pins ({customPins.length})</span>
                <span className="text-neutral-500">Click to Zoom</span>
              </div>

              {customPins.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center text-xs font-mono text-neutral-500">
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
                        className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/60 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all text-xs font-mono space-y-2 group shadow-2xs"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2.5 h-2.5 rounded-full shrink-0" 
                              style={{ backgroundColor: pin.color }} 
                            />
                            <div>
                              <div className="font-bold text-neutral-900 dark:text-slate-100">{pin.name}</div>
                              <div className="text-[10px] text-neutral-500 dark:text-slate-400">
                                {pin.formation || 'Subsurface Target'} {pin.depthMD ? `· ${pin.depthMD}m MD` : ''}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setZoomTarget([pin.lat, pin.lng])}
                              className="p-1 rounded text-neutral-500 hover:text-sky-600 dark:hover:text-cyan-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                              title="Zoom to pin location on map"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePin(pin.id)}
                              className="p-1 rounded text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                              title="Delete pin"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-neutral-800 dark:text-slate-300 font-bold truncate">
                            {formatCoords(pin.lat, pin.lng, coordFormat)}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleCopy(formatCoords(pin.lat, pin.lng, coordFormat), pin.id)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-amber-400 text-[10px] font-bold cursor-pointer transition-colors shrink-0"
                            title="Copy coordinates"
                          >
                            {copiedId === pin.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-emerald-600 dark:text-emerald-400">COPIED</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>COPY</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="text-[10px] text-neutral-500 dark:text-slate-400 flex items-center justify-between">
                          <span className="text-sky-700 dark:text-cyan-400 font-bold">
                            {distFromCenter} km from {centerWell.name}
                          </span>
                          <span className="text-neutral-500 font-mono">
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

        {/* ════════ TAB 2: OFFSET ANALOGS (Theme-Matched) ════════ */}
        {sidebarTab === 'offsets' && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            <div className="text-[11px] text-neutral-500 dark:text-slate-400 pb-1">
              {sortBy === 'distance'
                ? `Ranked by geographic distance from ${centerWell.name}`
                : `Ranked by multi-vector stratigraphic similarity to ${centerWell.name}`}
            </div>

            {sortedWells.map(({ well, distanceKm, similarity, inRadius }) => {
              const isCenter = well.id === centerWell.id;
              const simPct = Math.round(similarity.total * 100);
              const formattedWellCoords = formatCoords(well.coordinates.surfaceLat, well.coordinates.surfaceLng, coordFormat);

              return (
                <div
                  key={well.id}
                  onClick={() => {
                    setSelectedWell(well);
                    setZoomTarget([well.coordinates.surfaceLat, well.coordinates.surfaceLng]);
                  }}
                  className={`p-3 rounded-xl border transition cursor-pointer text-xs font-mono space-y-2 shadow-2xs ${
                    selectedWell?.id === well.id
                      ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30'
                      : isCenter
                      ? 'border-sky-400/60 bg-sky-50/40 dark:bg-cyan-950/20'
                      : inRadius
                      ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/60 hover:border-neutral-300 dark:hover:border-neutral-700'
                      : 'border-neutral-200/60 dark:border-neutral-800/50 bg-neutral-50/40 dark:bg-neutral-950/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 dark:text-slate-100">{well.name}</span>
                        <StatusBadge status={well.status} size="sm" />
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-slate-400 mt-0.5">
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
                        className="p-1.5 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-slate-300 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
                        title="Copy well coordinates"
                      >
                        {copiedId === `well-${well.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <Link
                        href={`/wells/${well.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        title="Open Well Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Surface Coordinates Row with Quick Copy Feedback */}
                  <div className="text-[10px] text-neutral-600 dark:text-slate-400 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/80 px-2 py-1 rounded border border-neutral-200/80 dark:border-neutral-800/80">
                    <span className="truncate">{formattedWellCoords}</span>
                    {copiedId === `well-${well.id}` && (
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold ml-1 shrink-0">COPIED</span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800/80 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1 text-neutral-700 dark:text-slate-300">
                      <MapPin className="w-3 h-3 text-sky-600 dark:text-cyan-400" />
                      <span>{distanceKm} km dist</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 font-bold">
                      <Compass className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className={simPct >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                        {simPct}% sim
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
