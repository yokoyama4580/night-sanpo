import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from '../components/Home/ThemeSelector';
import type { ThemeType } from '../components/Home/ThemeButton';
import LoadingScreen from '../components/Common/LoadingScreen';

const API_BASE = import.meta.env.VITE_API_BASE;

const THEME_TYPES: ThemeType[] = ['safety', 'scenic', 'comfort'];

const THEME_LABELS: Record<ThemeType, string> = {
    safety: '安全',
    scenic: '景色',
    comfort: '快適',
};

const themeProps: Record<ThemeType, { border: string; bg: string; text: string; focus: string; activeBg: string }> = {
    safety: {
        border: "border-green-500",
        bg: "bg-green-50",
        text: "text-green-700",
        focus: "focus:ring-green-200",
        activeBg: "bg-green-500"
    },
    scenic: {
        border: "border-orange-400",
        bg: "bg-orange-50",
        text: "text-orange-700",
        focus: "focus:ring-orange-200",
        activeBg: "bg-orange-400"
    },
    comfort: {
        border: "border-yellow-400",
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        focus: "focus:ring-yellow-100",
        activeBg: "bg-yellow-400"
    },
};

const Home: React.FC = () => {
    const [dist, setDist] = useState('');
    const [selected, setSelected] = useState<ThemeType[]>([]);
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [geoError, setGeoError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        if (!navigator.geolocation) {
            setGeoError('位置情報の取得がサポートされていません');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            pos => {
                setLat(pos.coords.latitude);
                setLon(pos.coords.longitude);
            },
            err => {
                setGeoError('位置情報の取得に失敗しました: ' + err.message);
            }
        );
    }, []);

    const handleSelect = (type: ThemeType) => {
        setSelected(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleClick = async () => {
        if (lat === null || lon === null) {
            setGeoError('現在地の取得が完了するまでお待ちください');
            return;
        }
        setIsLoading(true);  // ←追加（API開始時）
        try {
            const response = await fetch(`${API_BASE}/generate-route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lat: lat,
                    lon: lon,
                    distance: dist,
                    lambda_score: 0.1,
                    theme: selected,
                }),
            });
            const data = await response.json();
            navigate("/map", {
                state: { routeData: data }
            });
        } finally {
            setIsLoading(false); // MapView遷移でほぼ無効だが、失敗時にHome復帰したときのため
        }
    };

    // 追加：ローディング画面の表示
    if (isLoading) {
        return <LoadingScreen />;
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-green-50 to-orange-50">
            <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col gap-7 mx-auto my-auto">
                <div className="flex flex-col items-center gap-2 mb-2">
                    <h1 className="text-4xl font-extrabold text-green-700 drop-shadow">よるさんぽナビ</h1>
                    <p className="text-lg text-gray-500 font-medium">夜の散歩コースを自動でご提案</p>
                </div>
                <label className="flex flex-col gap-2">
                    <span className="text-base font-semibold text-gray-700">歩く距離（km）</span>
                    <input
                        type="number"
                        min={0}
                        value={dist}
                        onChange={e => setDist(e.target.value)}
                        className="rounded-xl border-2 border-green-200 px-4 py-2 text-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition"
                        placeholder="例: 3"
                    />
                </label>
                <div className="flex flex-col gap-2">
                    <span className="text-base font-semibold text-gray-700 mb-1">重視したいこと（複数選択可）</span>
                    <ThemeSelector
                        selected={selected}
                        onSelect={handleSelect}
                        themeTypes={THEME_TYPES}
                        themeLabels={THEME_LABELS}
                        themeProps={themeProps}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleClick}
                    className={`
                        w-full py-3 rounded-2xl bg-gradient-to-r from-green-400 to-orange-400
                        text-white text-xl font-extrabold shadow-xl
                        hover:from-green-500 hover:to-orange-500 transition-all duration-150
                        disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed
                    `}
                    disabled={lat === null || lon === null}
                >
                    ルート生成
                </button>
                {geoError && (
                    <div className="text-red-600 text-center text-sm">{geoError}</div>
                )}
            </div>
        </div>
    );
};

export default Home;
