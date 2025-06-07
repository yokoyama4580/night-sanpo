// pages/DiaryList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DiaryCard from '../components/Diary/DiaryCard';
import type { Diary } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE;

const DiaryList: React.FC = () => {
    const [diaries, setDiaries] = useState<Diary[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE}/diary/`)
            .then((res) => res.json())
            .then((data) => {
                const sorted = [...data].sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setDiaries(sorted);
            })
            .catch((err) => console.error('一覧取得エラー:', err));
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('この日記を削除しますか？')) return;
        try {
            const res = await fetch(`${API_BASE}/diary/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDiaries((prev) => prev.filter((d) => d.id !== id));
            } else {
                console.error('削除失敗');
            }
        } catch (err) {
            console.error('削除中のエラー:', err);
        }
    };

    const groupedByMonth: Record<string, Diary[]> = diaries.reduce((acc, diary) => {
        const date = new Date(diary.created_at);
        const key = `${date.getFullYear()}年${date.getMonth() + 1}月`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(diary);
        return acc;
    }, {} as Record<string, Diary[]>);

    return (
        <div className="min-h-screen w-screen bg-emerald-50 flex flex-col">
            <header className="text-center text-lg font-semibold py-4 shadow bg-white text-teal-500">
                よるさんぽ日記
            </header>

            <div className="text-sm text-gray-500 px-4 pt-4 pb-2">日記一覧</div>

            <main className="flex-1 px-4 pb-20 space-y-6">
                {Object.entries(groupedByMonth).map(([month, entries]) => (
                    <div key={month}>
                        <div className="text-md font-semibold text-gray-600 mb-2">{month}</div>
                        <div className="space-y-4">
                            {entries.map((diary) => (
                                <DiaryCard
                                    key={diary.id}
                                    diary={diary}
                                    isMenuOpen={openMenuId === diary.id}
                                    onToggleMenu={() => setOpenMenuId(openMenuId === diary.id ? null : diary.id)}
                                    onClickBody={() => navigate(`/view/${diary.id}`)}
                                    onEdit={() => navigate(`/edit/${diary.id}`)}
                                    onDelete={() => handleDelete(diary.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </main>

            <button
                onClick={() => navigate("/new")}
                className="fixed bottom-20 right-6 bg-orange-400 hover:bg-orange-500 text-white p-4 rounded-full shadow-md"
                aria-label="日記を作成"
            >
                <span className="material-icons">edit</span>
            </button>
        </div>
    );
};

export default DiaryList;
