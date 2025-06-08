import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE;

const NewDiary: React.FC = () => {
    const [text, setText] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(today);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const created_at = new Date(date).toISOString();

        try {
            const res = await fetch(`${API_BASE}/diary/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, created_at })
            });

            if (!res.ok) throw new Error('サーバーからの応答がありません');
            const result = await res.json();

            // text も一緒に送る
            navigate('/new/completed', {
                state: result
            });
        } catch (err) {
            console.error('送信エラー:', err);
        }
    };

    return (
        <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4 py-8">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl bg-white rounded-3xl shadow-lg p-6 space-y-6"
            >
                <h2 className="text-3xl font-bold text-teal-500 text-center">📝 日記を作成</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={today}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
                    <textarea
                        placeholder="今日の出来事や思ったことなど..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 rounded transition"
                >
                    保存する
                </button>
            </form>

            <button
                onClick={() => navigate('/')}
                className="absolute bottom-6 left-6 text-sm text-teal-600 hover:text-teal-400 transition"
            >
                ← 日記一覧に戻る
            </button>
        </div>
    );
};

export default NewDiary;
