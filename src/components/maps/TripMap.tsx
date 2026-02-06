import { useEffect, lazy, Suspense } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap } from 'react-leaflet';
import { 
  VIETNAM_CENTER, 
  VIETNAM_ZOOM,
  getProvinceCoordinates,
  getProvinceBounds 
} from '@/lib/vietnam-coordinates';
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

interface TripMapProps {
  provinces: string[];
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
function TripMapInner({ provinces }: { provinces: string[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (provinces.length === 0) {
      map.setView(VIETNAM_CENTER, VIETNAM_ZOOM);
      return;
    }
    
    const bounds = getProvinceBounds(provinces);
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, provinces]);
  
  const markers = provinces
    .map(province => {
      const coords = getProvinceCoordinates(province);
      if (!coords) return null;
      return { province, coords };
    })
    .filter(Boolean) as { province: string; coords: [number, number] }[];

  return (
    <>
      {markers.map(({ province, coords }) => (
        <Suspense key={province} fallback={null}>
          <Marker position={coords}>
            <Popup>
              <div className="font-medium">{province}</div>
            </Popup>
          </Marker>
        </Suspense>
      ))}
    </>
  );
}

export function TripMap({ provinces, className = '' }: TripMapProps) {
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
          <TripMapInner provinces={provinces} />
        </MapContainer>
      </Suspense>
    </div>
  );
}
