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
    const [dist, setDist] = useState<number>(0);

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-6">
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
                        id: id,
                        categories: categories,
                    })
                });

                if (!res.ok) throw new Error("ルート生成に失敗しました");
                const result = await res.json();

                navigate("/map", {
                    state: {
                        totalDatas : {
                            num_paths: result.num_paths,
                            distances: result.distances
                        }
                    }
                });

            } catch (err) {
                console.error("ルート生成エラー:", err);
                alert("マップの生成に失敗しました。");
            }

        }, (err) => {
            console.error("位置情報エラー:", err);
            alert("現在地の取得に失敗しました。");
        });
    };

    return (
        <div className="min-h-screen w-screen bg-emerald-50 p-6 flex items-center justify-center">
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
                    <h3 className="text-md font-semibold text-gray-600 mb-2">カテゴリ</h3>
                    <ul className="list-disc list-inside text-gray-700">
                        {categories.map((cat, idx) => (
                            <li key={idx}>{cat}</li>
                        ))}
                    </ul>
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
                        className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-semibold shadow transition"
                    >
                        マップを表示する
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
