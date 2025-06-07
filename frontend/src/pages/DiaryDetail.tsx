import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE;

type Diary = {
    id: string;
    text: string;
    created_at: string;
};

const DiaryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [diary, setDiary] = useState<Diary | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
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
    }, [id]);

    if (!diary) {
        return (
            <div className="min-h-screen w-screen flex items-center justify-center bg-emerald-50 p-6">
                <p className="text-red-500 text-center text-lg">日記が見つかりません</p>
            </div>
        );
    }

    const dateObj = new Date(diary.created_at);
    const displayDate = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;

    return (
        <div className="min-h-screen w-screen bg-emerald-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6">
                {/* 日付 */}
                <div className="pb-1">
                    <span className="text-sm text-gray-400">{displayDate}</span>
                </div>

                {/* タイトル */}
                <h2 className="text-2xl font-bold text-teal-600 mb-4">
                    {diary.text.split('\n')[0]}
                </h2>

                {/* 本文 */}
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-8 text-base">
                    {diary.text}
                </p>

                {/* 編集ボタン */}
                <div className="flex items-center justify-between mb-4">
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
