import { Box, Container, Typography } from '@mui/material';
import { SearchBar, Tab, Carousel } from '../components/components';
import { useTheme } from '@mui/material/styles';

const MaterialsPage = () => {
  const theme = useTheme();

  return (
    <Container>
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
        <Tab />
      </Box>
      <Box mt={2}>
        <Carousel />
      </Box>
    </Container>
  );
};

export default MaterialsPage;
