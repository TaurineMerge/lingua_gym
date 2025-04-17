import { Box } from '@mui/material';
import TopBar from './components/main/TopBar';
import LetterOverlay from './components/main/LetterOverlay';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';

function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#1C1C1E',
        position: 'relative',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <LetterOverlay />
        <Box sx={{ position: 'relative', zIndex: 1, height: '100vh' }}>
          <AuthProvider>  
            <TopBar />
            <Outlet />
          </AuthProvider>
        </Box>
    </Box>
  );
}

export default App;