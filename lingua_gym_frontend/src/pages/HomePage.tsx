import { Box, Container, Typography } from '@mui/material';
import { Tab, Carousel } from '../components/components';
import { useTheme } from '@mui/material/styles';

import { useState } from 'react';
import LetterOverlay from '../components/main/LetterOverlay';

const HomePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  return (
    <Container sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
      <LetterOverlay />
      <Box mt={4}>
        <Typography variant="h3" sx={{ 
          color: theme.palette.secondary.main, 
          fontWeight: theme.typography.h3.fontWeight,
          lineHeight: theme.typography.h3.lineHeight,
          fontSize: theme.typography.h3.fontSize
        }}>
          Добро пожаловать!
        </Typography>
      </Box>
      <Box mt={5}>
        <Tab 
          labels={['Сеты', 'Тексты']} 
          value={tabValue}
          onChange={(newVal) => setTabValue(newVal)}
        />
      </Box>
      <Box mt={4}>
        <Carousel tabValue={tabValue} title='Продолжи изучение' />
      </Box>
    </Container>
  );
};


export default HomePage;
