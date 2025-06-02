import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const HEADER_HEIGHT = 84;

const Header: React.FC = () => (
    <AppBar position="fixed" elevation={3}>
        <Toolbar
        sx={{
            minHeight: HEADER_HEIGHT,
            height: HEADER_HEIGHT,
            pl: 3,
        }}
        >
        <Typography
            variant="h4"
            component={RouterLink}
            to="/"
            sx={{
                textDecoration: 'none',
                color: 'common.white',
                transition: 'opacity 0.2s',
                '&:hover': {
                    opacity: 0.7,
                    textDecoration: 'none',
                },
                '&:visited': { color: 'common.white' },
                cursor: 'pointer',
            }}
        >
            よるさんぽナビ
        </Typography>
        </Toolbar>
    </AppBar>
);

export default Header;