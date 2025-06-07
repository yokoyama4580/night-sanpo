import React from 'react';
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

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-6">
                <p className="text-red-500 text-lg">データが見つかりません。</p>
            </div>
        );
    }

    const { text, description, categories } = state as LocationState;

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

                <div className="pt-4 text-center">
                    <button
                        onClick={() => {/* 今は何もしない */}}
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
