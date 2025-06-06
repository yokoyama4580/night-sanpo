import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
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

// 中心を動的に変更するための再利用可能な宣言的コンポーネント
const ChangeMapCenter: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
};

const MapView: React.FC = () => {
    const location = useLocation();
    const numRoutes = location.state?.numRoutes?.num_paths ?? 0;

    const defaultCenter: [number, number] = [36.6486, 138.1948];
    const [path, setPath] = useState<[number, number][]>([]);
    const [midNodes, setMidNodes] = useState<[number, number][]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [center, setCenter] = useState<[number, number]>(defaultCenter);

    const [error, setError] = useState<string | null>(null);

    const getSelectRoute = useCallback(async (index: number) => {
        try {
            setError(null);
            const res = await fetch(`${API_BASE}/select-route/${index}`);
            if (!res.ok) throw new Error('Network error');
            const routeData = await res.json();

            const pathData = Array.isArray(routeData?.path) ? routeData.path : [];
            const midData = Array.isArray(routeData?.mid_nodes) ? routeData.mid_nodes : [];

            setPath(pathData);
            setMidNodes(midData);
            setSelectedIndex(index);
            if (pathData.length > 0 && pathData[0] && pathData[0][0] != null && pathData[0][1] != null) {
                setCenter(pathData[0]);
            } else {
                setCenter(defaultCenter); // fallback
            }

            console.log("取得したルート情報:", routeData);
        } catch (err) {
            setError('ルートの取得に失敗しました');
            console.error('エラー:', err);
        }
    }, []);

    useEffect(() => {
        if (numRoutes > 0) {
            getSelectRoute(0);
        } else {
            setError('ルートの取得に失敗しました');
            console.error('表示するルートがありません');
        }
    }, [numRoutes, getSelectRoute]);

    return (
        <div className="w-screen h-screen relative bg-gray-50">
            {error && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded shadow z-[2000]">
                    {error}
                </div>
            )}
            {numRoutes > 0 && (
                <div className="absolute top-4 left-4 z-[1000] space-x-2 bg-white p-2 rounded shadow">
                    {Array.from({ length: numRoutes }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => getSelectRoute(i)}
                            aria-pressed={selectedIndex === i}
                            className={`px-3 py-1 border rounded ${
                                selectedIndex === i
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-blue-100 hover:bg-blue-300'
                            }`}
                        >
                            ルート{i + 1}
                        </button>
                    ))}
                </div>
            )}
            <MapContainer
                center={center}
                zoom={16}
                scrollWheelZoom={false}
                className="w-full h-full"
                style={{ minHeight: '100vh', minWidth: '100vw' }}
            >
                {/* 中心を動かす宣言的コンポーネント */}
                <ChangeMapCenter center={center} />

                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {center && center[0] != null && center[1] != null && (
                    <Marker position={center} icon={defaultIcon}>
                        <Popup>スタート地点</Popup>
                    </Marker>
                )}

                {midNodes.filter(pos => pos && pos[0] != null && pos[1] != null).map((pos, i) => (
                    <Marker key={i} position={pos} icon={defaultIcon}>
                        <Popup>中間地点{i + 1}</Popup>
                    </Marker>
                ))}

                {path.length > 1 && path.every(pos => pos && pos[0] != null && pos[1] != null) && (
                    <Polyline positions={path} color="blue" />
                )}
            </MapContainer>
        </div>
    );
};

export default MapView;
