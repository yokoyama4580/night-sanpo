import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import RouteMap from '../components/Map/RouteMap';
import ErrorBanner from '../components/Map/ErrorBanner';
import RouteCard from '../components/Map/RouteCard';
import 'leaflet/dist/leaflet.css';

const API_BASE = import.meta.env.VITE_API_BASE;

const MapView: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const numRoutes = location.state?.totalDatas?.num_paths ?? 0;
    const distances: number[] = location.state?.totalDatas?.distances ?? [];
    const entryId = location.state?.totalDatas?.entry_id ?? '';

    const [path, setPath] = useState<[number, number][]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ index }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || '保存に失敗しました');
            }

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
        }
    }, [numRoutes, getSelectRoute]);

    return (
        <div className="w-screen h-[calc(100vh-60px)] bg-gray-50 relative">
            {error && <ErrorBanner message={error} />}

            <RouteMap path={path} height={"h-full"} />

            {numRoutes > 0 && (
                <div className="absolute bottom-6 left-0 w-full z-[1000] overflow-x-auto px-10 py-2" ref={scrollRef}>
                    <div className="flex space-x-4">
                        {Array.from({ length: numRoutes }, (_, i) => (
                            <RouteCard
                                key={i}
                                index={i}
                                distance={distances[i]}
                                isSelected={selectedIndex === i}
                                onClick={() => getSelectRoute(i)}
                                onSave={() => handleSaveRoute(i)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapView;
