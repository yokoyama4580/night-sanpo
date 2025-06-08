import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import FitMapBounds from './FitMapBounds';
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

type Props = {
    path: [number, number][];
    height?: string;
};

const RouteMap: React.FC<Props> = ({ path, height = '[500px]' }) => {
    if (!path || path.length === 0) return null;

    return (
        <MapContainer
            center={path[0]}
            zoom={16}
            scrollWheelZoom={false}
            className={`w-full h-${height}`}
        >
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {path[0][0] != null && path[0][1] != null && (
                <Marker position={path[0]} icon={defaultIcon}>
                    <Popup>スタート地点</Popup>
                </Marker>
            )}
            {path.length > 1 && (
                <Polyline positions={path} pathOptions={{ color: 'green', weight: 8 }} />
            )}
            <FitMapBounds positions={path} />
        </MapContainer>
    );
};

export default RouteMap;