import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RouteMap from '../components/Map/RouteMap';

const API_BASE = import.meta.env.VITE_API_BASE;

type Diary = {
    id: string;
    text: string;
    created_at: string;
};

type Route = {
    path: [number, number][];
    index: number;
    total_km: number;
    score: number;
};

const DiaryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [diary, setDiary] = useState<Diary | null>(null);
    const [route, setRoute] = useState<Route | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 日記本文取得
        fetch(`${API_BASE}/diary/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then((data: Diary) => setDiary(data))
            .catch((err) => {
                console.error(err);
                setDiary(null);
            });

        // ルート取得
        fetch(`${API_BASE}/diary/${id}/paths`)
            .then((res) => {
                if (!res.ok) throw new Error('ルート取得エラー');
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setRoute(data[0]); // 選択された1件のみ
                }
            })
            .catch((err) => {
                console.error('ルート読み込み失敗:', err);
                setRoute(null);
            });
    }, [id]);

    if (!diary) {
        return (
            <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-6">
                <p className="text-red-500 text-center text-lg">日記が見つかりません</p>
            </div>
        );
    }

    const dateObj = new Date(diary.created_at);
    const displayDate = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;

    return (
        <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 space-y-6">
                {/* 日付 */}
                <div className="pb-1">
                    <span className="text-sm text-gray-400">{displayDate}</span>
                </div>

                {/* タイトル */}
                <h2 className="text-2xl font-bold text-gray-800">
                    {diary.text.split('\n')[0]}
                </h2>

                {/* 本文 */}
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                    {diary.text}
                </p>

                {/* 地図 */}
                {route && route.path.length > 0 ? (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">散歩ルート</h3>
                        <div className="rounded-xl overflow-hidden shadow">
                            <RouteMap path={route.path} height={"[700px]"} />
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 p-6 bg-yellow-50 text-yellow-700 rounded-md shadow-sm">
                        この日記にはまだ散歩ルートが登録されていません。
                    </div>
                )}

                {/* ボタン類 */}
                <div className="flex items-center justify-between pt-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-teal-500 hover:underline"
                    >
                        ← 一覧に戻る
                    </button>
                    <button
                        onClick={() => navigate(`/edit/${diary.id}`)}
                        className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-5 py-2 rounded shadow-sm transition"
                    >
                        編集する
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiaryDetail;