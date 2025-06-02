import React, { useState } from 'react';
import { TextField, Button, Typography, Stack, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const [steps, setSteps] = useState('');
    const [selected, setSelected] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSelect = (type: string) => setSelected(type);

    const handleClick = () => {
        // 情報をバックエンドに送る（距離、カテゴリ）
        navigate("/map");
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f5f6fa', // 任意で背景色を薄く
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
                    {['安全', '景色', '快適'].map(type => (
                        <Button
                            key={type}
                            variant={selected === type ? 'contained' : 'outlined'}
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
                >
                    ルート生成
                </Button>
            </Paper>
        </Box>
    );
};

export default Home;