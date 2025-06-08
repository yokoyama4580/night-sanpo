import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type LocationState = {
    id: string;
    text: string;
    created_at: string;
    categories: string[];
    description: string;
};

const NewDiaryComplete: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [dist, setDist] = useState<number>(3.0);

    // 🔸 追加: ローディング状態
    const [loading, setLoading] = useState(false);

    if (!state) {
        return (
            <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-6">
                <p className="text-red-500 text-lg">データが見つかりません。</p>
            </div>
        );
    }

    const { id, text, description, categories } = state as LocationState;

    const handleGenerateMap = async () => {
        if (!navigator.geolocation) {
            alert("位置情報が取得できません。");
            return;
        }

        setLoading(true); // 🔸 追加: ローディング開始

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE}/generate-route`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        lat,
                        lon,
                        distance: dist,
                        lambda_score: 0.3,
                        entry_id: id,
                        categories: categories,
                    })
                });

                if (!res.ok) throw new Error("ルート生成に失敗しました");
                const result = await res.json();

                navigate("/map", {
                    state: {
                        totalDatas : {
                            num_paths: result.num_paths,
                            distances: result.distances,
                            entry_id: result.entry_id
                        }
                    }
                });
            } catch (err) {
                console.error("ルート生成エラー:", err);
                alert("マップの生成に失敗しました。");
                setLoading(false); // 🔸 失敗時もローディング終了
            }
        }, (err) => {
            console.error("位置情報エラー:", err);
            alert("現在地の取得に失敗しました。");
            setLoading(false); // 🔸 エラー時もローディング終了
        });
    };

    // 🔸 ローディング中の画面
    if (loading) {
        return (
            <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-emerald-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full border-4 border-orange-400 border-t-transparent h-12 w-12 mx-auto mb-4"></div>
                    <p className="text-orange-500 font-semibold">ルートを生成中です…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 space-y-6">
                <h2 className="text-2xl font-bold text-teal-600 text-center">✅ 保存が完了しました</h2>

                <div>
                    <h3 className="text-md font-semibold text-gray-600 mb-2">あなたの日記</h3>
                    <p className="text-gray-800 whitespace-pre-wrap">{text}</p>
                </div>

                <div>
                    <h3 className="text-md font-semibold text-gray-600 mb-2">推定された心理状態</h3>
                    <p className="text-teal-700 font-medium">{description}</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        散歩したい距離（km）
                    </label>
                    <input
                        type="number"
                        value={dist}
                        onChange={(e) => setDist(parseFloat(e.target.value))}
                        min={0.5}
                        max={50}
                        step={0.5}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                </div>

                <div className="pt-4 text-center">
                    <button
                        onClick={handleGenerateMap}
                        className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        🚶 散歩ルートを生成する
                    </button>
                </div>

                <div className="pt-4 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-teal-600 hover:underline"
                    >
                        ← 一覧に戻る
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewDiaryComplete;
