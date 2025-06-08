import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useLocation, useNavigate } from 'react-router-dom';
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

const ChangeMapBounds: React.FC<{ positions: [number, number][] }> = ({ positions }) => {
    const map = useMap();

    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [positions, map]);

    return null;
};

const MapView: React.FC = () => {
    const location = useLocation();
    const numRoutes = location.state?.totalDatas?.num_paths ?? 0;
    const distances: number[] = location.state?.totalDatas?.distances ?? [];
    const entryId = location.state?.totalDatas?.entry_id ?? "";

    const navigate = useNavigate();

    const defaultCenter: [number, number] = [36.6486, 138.1948];
    const [path, setPath] = useState<[number, number][]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [center, setCenter] = useState<[number, number]>(defaultCenter);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const getSelectRoute = useCallback(async (index: number) => {
        try {
            setError(null);
            const res = await fetch(`${API_BASE}/select-route/${index}`);
            if (!res.ok) throw new Error('Network error');
            const routeData = await res.json();

            const pathData = Array.isArray(routeData?.path) ? routeData.path : [];

            setPath(pathData);
            setSelectedIndex(index);
            if (pathData.length > 0 && pathData[0] && pathData[0][0] != null && pathData[0][1] != null) {
                setCenter(pathData[0]);
            } else {
                setCenter(defaultCenter);
            }

            const container = scrollRef.current;
            if (container) {
                const card = container.querySelector(`#route-card-${index}`) as HTMLElement;
                if (card) {
                    container.scrollTo({
                        left: card.offsetLeft - container.offsetWidth / 2 + card.offsetWidth / 2,
                        behavior: 'smooth',
                    });
                }
            }
        } catch (err) {
            setError('ルートの取得に失敗しました');
            console.error('エラー:', err);
        }
    }, []);

    const handleSaveRoute = async (index: number) => {
        if (!entryId) {
            alert('日記IDが取得できませんでした');
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/diary/${entryId}/paths`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ index }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || '保存に失敗しました');
            }

            const result = await res.json();
            console.log('保存成功:', result);

            alert('ルートを保存しました！');
            navigate('/');
        } catch (err) {
            console.error('保存エラー:', err);
            alert('ルートの保存に失敗しました。');
        }
    };

    useEffect(() => {
        if (numRoutes > 0) {
            getSelectRoute(0);
        } else {
            setError('ルートの取得に失敗しました');
            console.error('表示するルートがありません');
        }
    }, [numRoutes, getSelectRoute]);

    return (
        <div className="pt-[84px] w-screen h-screen bg-gray-50 relative">
            {error && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded-md shadow-md z-[2000]">
                    {error}
                </div>
            )}
            <MapContainer
                center={center}
                zoom={16}
                scrollWheelZoom={false}
                className="w-full h-full"
            >
                <ChangeMapBounds positions={path} />

                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {center && center[0] != null && center[1] != null && (
                    <Marker position={center} icon={defaultIcon}>
                        <Popup>スタート地点</Popup>
                    </Marker>
                )}

                {path.length > 1 && path.every(pos => pos && pos[0] != null && pos[1] != null) && (
                    <Polyline positions={path} pathOptions={{ color: 'green', weight: 8 }} />
                )}
            </MapContainer>

            {numRoutes > 0 && (
                <div className="absolute bottom-6 left-0 w-full z-[1000] overflow-x-auto px-10 py-2" ref={scrollRef}>
                    <div className="flex space-x-4">
                        {Array.from({ length: numRoutes }, (_, i) => (
                            <div
                                key={i}
                                id={`route-card-${i}`}
                                onClick={() => getSelectRoute(i)}
                                className={`min-w-[260px] cursor-pointer bg-white rounded-2xl shadow-md p-4 space-y-2 border transition-transform duration-200 ${
                                    selectedIndex === i
                                        ? 'border-green-500 ring-2 ring-green-300 scale-105 z-10'
                                        : 'border-gray-200 scale-100'
                                }`}
                            >
                                <p className="text-sm text-gray-700 font-semibold">ルート{i + 1}</p>
                                <p className="text-base text-gray-800 font-bold">
                                    {distances[i] != null ? `${distances[i].toFixed(1)} km` : '---'}
                                </p>
                                <button
                                    onClick={() => handleSaveRoute(i)}
                                    className="w-full py-2 px-4 text-white font-semibold rounded-full bg-orange-400 hover:bg-orange-700 shadow-md hover:shadow-lg transition duration-200 ease-in-out"
                                >
                                    このルートを選択
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapView;