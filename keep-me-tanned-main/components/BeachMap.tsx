import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Search, ArrowRight, Star } from 'lucide-react';
import { BeachLocation, GeoLocation } from '../types';
import { findNearbyBeaches } from '../services/geminiService';

// --- Custom Marker Icons ---
const createCustomIcon = (color: string) => new L.DivIcon({
  className: 'custom-div-icon',
  html: `
    <div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      position: relative;
    ">
      ${color === '#3b82f6' ? '<div class="pin-pulse" style="position:absolute; inset:-10px; border-radius:50%; background-color:rgba(59, 130, 246, 0.5); z-index:-1;"></div>' : ''}
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

const userIcon = createCustomIcon('#3b82f6'); // Blue for user
const beachIcon = createCustomIcon('#f97316'); // Orange for beaches

interface Props {
  userLocation: GeoLocation;
}

// Component to handle map movements
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { duration: 1.5 });
  }, [center, map]);
  return null;
}

const BeachMap: React.FC<Props> = ({ userLocation }) => {
  const [beaches, setBeaches] = useState<BeachLocation[]>([]);
  const [selectedBeach, setSelectedBeach] = useState<BeachLocation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBeaches = async () => {
      setLoading(true);
      const results = await findNearbyBeaches(userLocation.lat, userLocation.lon);
      setBeaches(results);
      setLoading(false);
    };
    loadBeaches();
  }, [userLocation]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#eef2f5]">
      {/* Map Layer */}
      <MapContainer 
          center={[userLocation.lat, userLocation.lon]} 
          zoom={13} 
          zoomControl={false}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
      >
          <MapController center={[userLocation.lat, userLocation.lon]} />
          
          {/* CartoDB Voyager - Looks very similar to modern Google Maps/Apple Maps */}
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* User Marker */}
          <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon} zIndexOffset={1000}>
             {/* No popup for user, just visual location */}
          </Marker>

          {/* Beach Markers */}
          {beaches.map((beach, idx) => (
              <Marker 
                key={idx} 
                position={[beach.lat, beach.lon]} 
                icon={beachIcon}
                eventHandlers={{
                  click: () => setSelectedBeach(beach),
                }}
              />
          ))}
      </MapContainer>

      {/* --- Floating UI Overlay --- */}

      {/* Top Search Bar (Visual Only) */}
      <div className="absolute top-14 left-4 right-4 z-[500] pointer-events-none">
        <div className="glass-card rounded-2xl h-12 flex items-center px-4 gap-3 pointer-events-auto shadow-lg shadow-black/5">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Sök plats..." 
            className="bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 font-medium w-full h-full"
            disabled
          />
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
             <div className="w-2 h-2 rounded-full bg-orange-500" />
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-[500] glass-card px-4 py-2 rounded-full flex items-center gap-2">
           <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
           <span className="text-xs font-bold text-slate-600">Hittar stränder...</span>
        </div>
      )}

      {/* Bottom Card Area */}
      <div className="absolute bottom-24 left-4 right-4 z-[500] flex flex-col justify-end pointer-events-none">
         {selectedBeach ? (
           <div className="glass-card p-5 rounded-[1.5rem] pointer-events-auto animate-enter shadow-2xl shadow-black/10">
              <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{selectedBeach.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-orange-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold">4.8</span>
                      <span className="text-xs text-slate-400 font-normal ml-1">(Populär plats)</span>
                    </div>
                 </div>
                 <button 
                   onClick={() => setSelectedBeach(null)}
                   className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200"
                 >
                   ✕
                 </button>
              </div>
              
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{selectedBeach.description}</p>
              
              <div className="flex gap-3">
                 <a 
                   href={`https://www.google.com/maps/search/?api=1&query=${selectedBeach.lat},${selectedBeach.lon}`}
                   target="_blank"
                   rel="noreferrer"
                   className="flex-1 bg-blue-600 text-white h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                 >
                   <Navigation className="w-4 h-4" />
                   Vägbeskrivning
                 </a>
                 <button className="flex-1 bg-white border border-slate-200 text-slate-700 h-11 rounded-xl font-semibold text-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                   Mer info
                 </button>
              </div>
           </div>
         ) : (
           /* "Explore" prompts when no beach is selected */
           <div className="flex gap-3 overflow-x-auto pb-2 pointer-events-auto no-scrollbar">
              {beaches.map((beach, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedBeach(beach)}
                  className="glass-card p-3 rounded-2xl min-w-[160px] flex flex-col gap-2 text-left active:scale-95 transition-transform"
                >
                   <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                     <MapPin className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="font-bold text-sm text-slate-900 truncate">{beach.name}</p>
                     <p className="text-[10px] text-slate-500 truncate">Klicka för info</p>
                   </div>
                </button>
              ))}
           </div>
         )}
      </div>
    </div>
  );
};

export default BeachMap;