import React, { useState } from 'react';
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

const API_BASE = import.meta.env.VITE_API_BASE;

const MapView: React.FC = () => {
    const location = useLocation();
    const numRoutes = location.state?.numRoutes?.num_paths ?? 0;

    const centerPosition: [number, number] = [36.6486, 138.1948];

    {/* ルート選択 */}
    const handleSelectRoute = async (index: number) => {
        try {
            const res = await fetch(`${API_BASE}/select-route/${index}`);
            if (!res.ok) throw new Error('Network error');
            const routeData = await res.json();
            console.log('取得したルート情報:', routeData);
        } catch (err) {
            console.error('エラー:', err);
        }
    };

    return (
        <div className="w-screen h-screen relative bg-gray-50">
            {numRoutes > 0 && (
                <div className="absolute top-4 left-4 z-[1000] space-x-2 bg-white p-2 rounded shadow">
                    {Array.from({ length: numRoutes }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handleSelectRoute(i)}
                        className="px-3 py-1 border rounded bg-blue-100 hover:bg-blue-300"
                    >
                        ルート{i + 1}
                    </button>
                    ))}
                </div>
            )}
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
            </MapContainer>
        </div>
    );
};

export default MapView;