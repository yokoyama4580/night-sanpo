import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE;

type Diary = {
    id: string;
    text: string;
    created_at: string;
};

const EditDiary: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [text, setText] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE}/diary/${id}`)
            .then((res) => res.json())
            .then((data: Diary) => {
                setText(data.text);
                const date = new Date(data.created_at);
                setCreatedAt(date.toISOString().slice(0, 10));
            })
            .catch((err) => console.error('取得エラー:', err));
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/diary/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            if (res.ok) {
                navigate(`/`);
            } else {
                console.error('更新失敗');
            }
        } catch (err) {
            console.error('送信エラー:', err);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-emerald-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-2xl font-bold text-teal-600 mb-1">日記の編集</h2>
                <p className="text-sm text-gray-500 mb-6">内容を修正し、「更新する」を押してください。</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="date">
                            日付
                        </label>
                        <input
                            id="date"
                            type="date"
                            value={createdAt}
                            onChange={(e) => setCreatedAt(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="text">
                            内容
                        </label>
                        <textarea
                            id="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded h-40 resize-none focus:outline-none focus:ring-2 focus:ring-teal-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-400 text-white font-semibold py-2 px-4 rounded hover:bg-orange-500 transition-colors"
                    >
                        更新する
                    </button>
                </form>
            </div>
            <button
                onClick={() => navigate('/')}
                className="absolute bottom-6 left-6 text-sm text-teal-600 hover:text-teal-400 transition"
            >
                ← 日記一覧に戻る
            </button>
        </div>
    );
};

export default EditDiary;
