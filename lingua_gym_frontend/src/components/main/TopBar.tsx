import { AppBar, Toolbar, Typography, Box, IconButton, Stack, Button, Divider, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import laurel_wreath from '../../../public/laurel_wreath.svg';

const TopBar = ({ isExtended = true, linguaPoints = 325 }) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        boxShadow: 'none',
        padding: '1rem 2rem',
        minHeight: '10vh',
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
          {isExtended &&
            <Stack direction="row" spacing={{ xs: 0.25, sm: 0.5, md: 0.75, lg: 1 }}>
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
          }
        </Box>

        {isExtended ? (
          <Box display="flex" alignItems="center" justifyContent="right" width="50%" gap={2}>
            <Tooltip title="Лавры Лингвы">
              <Box display="flex" alignItems="center" sx={{ color: '#FFFFFFAA', fontWeight: 600, border: '1px solid #444', borderRadius: '0.5rem', padding: '0.25rem 0.5rem' }}>
                <Box
                  component="img"
                  src={laurel_wreath}
                  alt="Лавры Лингвы"
                  sx={{ width: '2rem', height: '2rem', mr: 1 }}
                />
                <Typography variant="body1" sx={{ color: '#FFFFFF' }}>{linguaPoints}</Typography>
              </Box>
            </Tooltip>
            <IconButton sx={{ color: '#FFFFFF' }}>
              <SettingsIcon sx={{ fontSize: '2rem' }} />
            </IconButton>
            <IconButton sx={{ color: '#FFFFFF' }}>
              <AccountCircleIcon sx={{ fontSize: '2rem' }} />
            </IconButton>
          </Box>
        ) : (
          <Button
            component={Link}
            to="/login"
            sx={{
              color: '#EEE',
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': {
                color: '#0A84FF',
              },
            }}
          >
            Войти в аккаунт
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
