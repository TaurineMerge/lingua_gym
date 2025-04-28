import { Outlet } from 'react-router-dom';
import TopBar from './components/main/TopBar';
import { Box } from '@mui/material';

function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#111',
        position: 'relative',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, height: '100vh' }}>
        <TopBar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
