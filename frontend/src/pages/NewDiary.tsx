// src/pages/NewDiary.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NewDiary: React.FC = () => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [body, setBody] = useState('');
    const [dist, setDist] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLat(position.coords.latitude);
                setLon(position.coords.longitude);
            },
            (error) => {
                console.error("位置情報の取得に失敗しました", error);
            }
        );
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (lat === null || lon === null) {
            alert("現在地の取得に失敗しています");
            return;
        }
        console.log("aaasfagjdsflkajslfja");
        console.log(lat, lon, dist, body)

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE}/generate-route`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    diary: body,
                    distance: dist,
                    lat: lat,
                    lon: lon,
                    lambda_score: 0.3
                }),
            });

            if (!res.ok) {
                throw new Error('送信に失敗しました');
            }
            const result = await res.json();
            console.log('送信成功:', result);
            navigate("/map", {
                state: { 
                    totalDatas: {
                        num_paths: result.num_paths,
                        distances: result.distances
                    }
                }
            });
            // 必要に応じて画面遷移や通知
        } catch (err) {
            console.error('エラー:', err);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">新しい日記を書く</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">タイトル</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">日付</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">本文</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full border px-3 py-2 rounded h-40 resize-none"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">距離（km）</label>
                    <input
                        type="number"
                        value={dist}
                        onChange={(e) => setDist(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        step="0.1"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium">画像（任意）</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        className="w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    保存
                </button>
            </form>
        </div>
    );
};

export default NewDiary;
