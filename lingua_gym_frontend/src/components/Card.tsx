import {
    Card, CardContent, Typography, Button, Avatar, Box,
    useTheme,
  } from '@mui/material';
  import ArticleIcon from '@mui/icons-material/Article';
  import { MaterialsCardProps } from '../types/NewMaterials';
  
  const CardComponent = ({ title, description, username, tags, language }: MaterialsCardProps) => {
    const theme = useTheme();

    return (
      <Card sx={{ minWidth: 280, height: 506, m: 0.5, backgroundColor: '#EEE', pb: 0, maxHeight: '100%', transition: 'all 0.3s ease', "&:hover": { backgroundColor: '#FFF', cursor: 'grab' } }}>
        <Box
          sx={{ backgroundColor: '#0A84FF', p: 2, color: '#000', display: 'flex', justifyContent: 'center', height: '15%' }}
        >
          <ArticleIcon sx={{ fontSize: 40 }} />
        </Box>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2, height: '85%' }}>
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary }} gutterBottom>{title}</Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, overflow: 'auto', height: '7rem', fontSize: '0.875rem' }}>{description}</Typography>
          <Box display="flex" alignItems="center" my={2}>
            <Avatar sx={{ bgcolor: '#D9D5E4', width: 24, height: 24, mr: 1, p: 2 }}>A</Avatar>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>{username}</Typography>
          </Box>
          <Button variant="contained">View</Button>
          <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexWrap="wrap" gap={0.5} width="80%">
            {tags.map((tag, index) => {
              const typographyStyle = {
                backgroundColor: '#1C1C1C',
                color: '#fff',
                borderRadius: '12px',
                px: 1,
                py: 0.5,
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
              }

              if (index == 2) return (
                <>
                  <Typography
                    key={index}
                    variant="caption"
                    sx={{
                      ...typographyStyle
                    }}
                  >
                    ...
                  </Typography>
                  <Typography
                    key={index}
                    variant="caption"
                    sx={{
                      ...typographyStyle
                    }}
                  >
                    +{tags.length - 2}
                  </Typography>
                </>
              );
              if (index > 2) return null;
              return (
                <Typography
                  key={index}
                  variant="caption"
                  sx={{
                    ...typographyStyle
                  }}
                >
                  #{tag}
                </Typography>
              );
            })}
          </Box>

          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            {language}
          </Typography>
        </Box>
        </CardContent>
      </Card>
    );
  };
  
  export default CardComponent;
  