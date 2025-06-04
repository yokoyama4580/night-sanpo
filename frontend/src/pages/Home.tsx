import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Stack, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE

const Home: React.FC = () => {
    const [steps, setSteps] = useState('');
    // ★テーマは複数選択可能な配列に
    const [selected, setSelected] = useState<string[]>([]);
    const [lat, setLat] = useState<number | null>(null);
    const [lon, setLon] = useState<number | null>(null);
    const [geoError, setGeoError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!navigator.geolocation) {
            setGeoError('位置情報の取得がサポートされていません');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            pos => {
                setLat(pos.coords.latitude);
                setLon(pos.coords.longitude);
            },
            err => {
                setGeoError('位置情報の取得に失敗しました: ' + err.message);
            }
        );
    }, []);

    // ★トグル式で追加/削除
    const handleSelect = (type: string) => {
        setSelected(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const handleClick = async () => {
        if (lat === null || lon === null) {
            setGeoError('現在地の取得が完了するまでお待ちください');
            return;
        }
        console.log("lat, lon, dist, score, theme");
        console.log(lat, lon, steps, 0,3, selected);

        const response = await fetch(`${API_BASE}/generate-route`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: lat,
                lon: lon,
                distance: steps,
                lambda_score: 0.3,
                theme: selected,
            }),
        });

        const data = await response.json();
        navigate("/map", {
            state: { routeData: data }
        });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f6fa',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    minWidth: 320,
                    maxWidth: 380,
                    mx: "auto",
                    my: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    歩数と目的
                </Typography>
                <TextField
                    label="歩く距離（km）"
                    type="number"
                    value={steps}
                    onChange={e => setSteps(e.target.value)}
                    sx={{ width: 250 }}
                    inputProps={{ min: 0 }}
                />
                <Stack direction="row" spacing={2}>
                    {['safety', 'scenic', 'comfort'].map(type => (
                        <Button
                            key={type}
                            // ★配列に含まれているかで「選択中」判定
                            variant={selected.includes(type) ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={() => handleSelect(type)}
                            sx={{ width: 100, fontWeight: 'bold' }}
                        >
                            {type}
                        </Button>
                    ))}
                </Stack>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClick}
                    size="large"
                    sx={{
                        width: 200,
                        height: 56,
                        fontSize: 20,
                        px: 5,
                    }}
                    disabled={lat === null || lon === null}
                >
                    ルート生成
                </Button>
                {/* 現在地取得エラー表示 */}
                {geoError && (
                    <Typography color="error" variant="body2">{geoError}</Typography>
                )}
            </Paper>
        </Box>
    );
};

export default Home;
