import { useEffect, lazy, Suspense } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from 'react-leaflet';
import { VIETNAM_CENTER, VIETNAM_ZOOM } from '@/lib/vietnam-coordinates';
import type { TripItem } from '@/types/database';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load react-leaflet components to avoid SSR/hydration issues
const MapContainer = lazy(() => import('react-leaflet').then(m => ({ default: m.MapContainer })));
const TileLayer = lazy(() => import('react-leaflet').then(m => ({ default: m.TileLayer })));
const Marker = lazy(() => import('react-leaflet').then(m => ({ default: m.Marker })));
const Popup = lazy(() => import('react-leaflet').then(m => ({ default: m.Popup })));

// Fix for default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface ItemsMapProps {
  items: TripItem[];
  className?: string;
}

function MapLoading({ className }: { className?: string }) {
  return (
    <div className={`rounded-lg overflow-hidden border ${className}`}>
      <Skeleton className="w-full h-full min-h-[300px]" />
    </div>
  );
}

// Inner map component that uses useMap hook
function ItemsMapInner({ items }: { items: TripItem[] }) {
  const map = useMap();
  
  useEffect(() => {
    const itemsWithCoords = items.filter(item => item.lat && item.lng);
    
    if (itemsWithCoords.length === 0) {
      map.setView(VIETNAM_CENTER, VIETNAM_ZOOM);
      return;
    }
    
    if (itemsWithCoords.length === 1) {
      map.setView([itemsWithCoords[0].lat!, itemsWithCoords[0].lng!], 14);
      return;
    }
    
    const bounds = L.latLngBounds(
      itemsWithCoords.map(item => [item.lat!, item.lng!] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, items]);

  const itemsWithCoords = items.filter(item => item.lat && item.lng);

  return (
    <>
      {itemsWithCoords.map((item) => (
        <Suspense key={item.id} fallback={null}>
          <Marker position={[item.lat!, item.lng!]}>
            <Popup>
              <div>
                <div className="font-medium">{item.title}</div>
                {item.location_name && (
                  <div className="text-sm text-muted-foreground">{item.location_name}</div>
                )}
                {item.start_time && (
                  <div className="text-xs mt-1">{item.start_time}</div>
                )}
              </div>
            </Popup>
          </Marker>
        </Suspense>
      ))}
    </>
  );
}

export function ItemsMap({ items, className = '' }: ItemsMapProps) {
  return (
    <div className={`rounded-lg overflow-hidden border ${className}`}>
      <Suspense fallback={<MapLoading className={className} />}>
        <MapContainer
          center={VIETNAM_CENTER}
          zoom={VIETNAM_ZOOM}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', minHeight: '300px' }}
        >
          <Suspense fallback={null}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </Suspense>
          <ItemsMapInner items={items} />
        </MapContainer>
      </Suspense>
    </div>
  );
}
