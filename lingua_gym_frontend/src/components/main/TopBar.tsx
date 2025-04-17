import { AppBar, Toolbar, Typography, Box, IconButton, Stack, Button } from '@mui/material';
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
            <Button component={Link} to={'/library'} sx={{ color: '#FFFFFF', fontSize: '1rem', textTransform: 'none' }}>
              My Library
            </Button>
            <Button component={Link} to={'/materials'} sx={{ color: '#FFFFFF', fontSize: '1rem', textTransform: 'none' }}>
              New Materials
            </Button>
          </Stack>
        </Box>

        {/* Right: Icons */}
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
