import { Box, Container, Typography } from '@mui/material';
import { SearchBar, Tab, Carousel } from '../components/components';
import { useTheme } from '@mui/material/styles';

import { useState } from 'react';
import LetterOverlay from '../components/main/LetterOverlay';

const HomePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  return (
    <Container>
      <LetterOverlay />
      <Box mt={4}>
        <Typography variant="h3" sx={{ 
          color: theme.palette.secondary.main, 
          fontWeight: theme.typography.h3.fontWeight,
          lineHeight: theme.typography.h3.lineHeight,
          fontSize: theme.typography.h3.fontSize
        }}>
          Search for new materials
        </Typography>
      </Box>
      <Box mt={2}>
        <SearchBar />
      </Box>
      <Box mt={2}>
        <Tab 
          labels={['Sets', 'Texts']} 
          value={tabValue}
          onChange={(newVal) => setTabValue(newVal)}
        />
      </Box>
      <Box mt={2}>
        <Carousel tabValue={tabValue} />
      </Box>
    </Container>
  );
};


export default HomePage;
