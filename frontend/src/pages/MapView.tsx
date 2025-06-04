import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const defaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const MapView: React.FC = () => {
    const location = useLocation();
    const routeData = location.state?.routeData;
    const path = routeData?.path || [];
    const centerPosition = path[0];

    return (
        <div className="w-screen h-screen relative bg-gray-50">
            {/* 必要ならタイトルや戻るボタンをここに追加 */}
            <MapContainer
                center={centerPosition}
                zoom={16}
                className="w-full h-full"
                style={{ minHeight: '100vh', minWidth: '100vw' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={centerPosition} icon={defaultIcon}>
                    <Popup>現在地！</Popup>
                </Marker>
                {path.length > 1 && (
                    <Polyline positions={path} color="blue" />
                )}
            </MapContainer>
        </div>
    );
};

export default MapView;