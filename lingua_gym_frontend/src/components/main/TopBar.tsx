import { AppBar, Toolbar, Typography, Box, IconButton, Stack, Button, Divider } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

const TopBar = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
        padding: '1rem 2rem',
        minHeight: '10vh'
      }}
    >
      <Toolbar disableGutters sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center" justifyContent={'space-between'} width={'50%'}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#0A84FF',
              fontSize: '2rem',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
              LinguaGym
          </Typography>
          <Stack  direction="row" spacing={{ xs: 0.25, sm: 0.5, md: 0.75, lg: 1 }}>
            <Button component={Link} to={'/'} sx={{ color: '#FFFFFF', fontSize: '1rem', textTransform: 'none' }}>
              Главная
            </Button>
            <Divider orientation="vertical" variant="middle" aria-hidden="true" role="presentation" flexItem />
            <Button component={Link} to={'/library'} sx={{ color: '#FFFFFF', fontSize: '1rem', textTransform: 'none' }}>
              Библиотека
            </Button>
            <Divider orientation="vertical" variant="middle" aria-hidden="true" role="presentation" flexItem />
            <Button component={Link} to={'/materials'} sx={{ color: '#FFFFFF', fontSize: '1rem', textTransform: 'none' }}>
              Поиск
            </Button>
            <Divider orientation="vertical" variant="middle" aria-hidden="true" role="presentation" flexItem />
            <Button component={Link} to={'/progress'} sx={{ color: '#FFFFFF', fontSize: '1rem', textTransform: 'none' }}>
              Прогресс
            </Button>
          </Stack>
        </Box>

        <Box display="flex" alignItems="center" justifyContent={'right'} width={'50%'}>
          <IconButton sx={{ color: '#FFFFFF' }}>
            <SettingsIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
          <IconButton sx={{ color: '#FFFFFF' }}>
            <AccountCircleIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
