import AppRoutes from './routes/index.tsx';
import { Box } from '@mui/material';
import TopBar from './components/TopBar';
import LetterOverlay from './components/LetterOverlay';

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
        <TopBar />
        <AppRoutes />
      </Box>
    </Box>
  );
}

export default App;