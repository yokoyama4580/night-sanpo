import React from 'react';
import { useNavigate } from 'react-router-dom';

// 夜のイメージを出すためのSVGイラスト（星空＋ランタン）
const NightWalkIllustration = () => (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mx-auto mb-6">
        <circle cx="60" cy="60" r="40" fill="#374151" />
        <circle cx="60" cy="60" r="38" fill="#334155" />
        {/* 月 */}
        <circle cx="80" cy="50" r="10" fill="#ffe066" />
        {/* 星 */}
        <circle cx="40" cy="42" r="1.5" fill="#fff9db" />
        <circle cx="52" cy="35" r="1.2" fill="#fff9db" />
        <circle cx="72" cy="42" r="1.2" fill="#fff9db" />
        <circle cx="90" cy="55" r="0.8" fill="#fff9db" />
        <circle cx="75" cy="70" r="0.7" fill="#fff9db" />
        {/* ランタン */}
        <rect x="55" y="80" width="10" height="13" rx="5" fill="#ffa600" />
        <rect x="59" y="93" width="2" height="4" fill="#7c4700" />
    </svg>
);

const LoadingScreen: React.FC<{ onCancel?: () => void }> = ({ onCancel }) => {
    const navigate = useNavigate();

    // スピナー
    const Spinner = () => (
        <div className="flex justify-center items-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-400 border-b-4 border-orange-300" />
        </div>
    );

    // 戻る
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen min-h-screen bg-gradient-to-br from-slate-900 to-green-900 text-white">
            <div className="w-full max-w-sm bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center mx-auto">
                <NightWalkIllustration />
                <Spinner />
                <h2 className="text-2xl font-extrabold text-green-700 mb-2 drop-shadow">散歩ルートを作成中…</h2>
                <p className="text-base text-gray-700 mb-6">素敵な夜道を探索しています！<br />そのまま少しお待ちください。</p>
                <button
                    onClick={handleCancel}
                    className="mt-4 px-6 py-2 rounded-lg bg-orange-400 text-white font-bold hover:bg-orange-500 transition"
                >
                    戻る
                </button>
            </div>
        </div>
    );
};

export default LoadingScreen;