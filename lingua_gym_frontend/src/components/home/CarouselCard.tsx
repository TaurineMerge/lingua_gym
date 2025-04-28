import {
    Card, CardContent, Typography, Button, Avatar, Box,
    useTheme,
  } from '@mui/material';
  import ArticleIcon from '@mui/icons-material/Article';
  import { MaterialsCardProps } from '../../types/NewMaterials';
  import ViewModuleIcon from '@mui/icons-material/ViewModule';
  
  const CardComponent = ({ title, description, username, tags, language, type }: MaterialsCardProps) => {
    const theme = useTheme();

    return (
      <Card sx={{ minWidth: 280, height: 506, m: 0.5, backgroundColor: '#1A1A1A', pb: 0, maxHeight: '100%', transition: 'all 0.3s ease', "&:hover": { backgroundColor: '#1F1F1F', cursor: 'grab' } }}>
        {type === 'set' ? (
          <Box
            sx={{ p: 2, color: '#000', display: 'flex', justifyContent: 'left', height: '15%' }}
          >
            <ArticleIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          </Box>
        ) : (
          <Box
            sx={{ p: 2, color: '#000', display: 'flex', justifyContent: 'left', height: '15%' }}
          >
            <ViewModuleIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
          </Box>
        )}
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2, height: '85%' }}>
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }} gutterBottom>{title}</Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.primary, overflow: 'auto', height: '7rem', fontSize: '0.875rem' }}>{description}</Typography>
          <Box display="flex" alignItems="center" my={2}>
            <Avatar sx={{ bgcolor: '#D9D5E4', width: 24, height: 24, mr: 1, p: 2 }}>A</Avatar>
            <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>{username}</Typography>
          </Box>
          <Button variant="contained">View</Button>
          <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexWrap="wrap" gap={0.5} width="80%">
          {tags.slice(0, 2).map((tag, index) => (
            <Typography
              key={`tag-${index}`}
              variant="caption"
              sx={{
                backgroundColor: '#222',
                color: '#fff',
                borderRadius: '12px',
                px: 1,
                py: 0.5,
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
              }}
            >
              #{tag}
            </Typography>
          ))}
          {tags.length > 2 && (
            <>
              <Typography
                key="ellipsis"
                variant="caption"
                sx={{
                  backgroundColor: '#222',
                  color: '#fff',
                  borderRadius: '12px',
                  px: 1,
                  py: 0.5,
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap',
                }}
              >
                ...
              </Typography>
              <Typography
                key="remaining-count"
                variant="caption"
                sx={{
                  backgroundColor: '#222',
                  color: '#fff',
                  borderRadius: '12px',
                  px: 1,
                  py: 0.5,
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap',
                }}
              >
                +{tags.length - 2}
              </Typography>
            </>
          )}
        </Box>

          <Typography variant="caption" sx={{ color: theme.palette.primary.main }}>
            {language}
          </Typography>
        </Box>
        </CardContent>
      </Card>
    );
  };
  
  export default CardComponent;
  