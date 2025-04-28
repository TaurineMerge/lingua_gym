import { useState } from "react";
import { Box, Card, Typography, Avatar, Chip, Divider, useTheme, Button } from "@mui/material";
import { Article as ArticleIcon } from "@mui/icons-material";

interface SearchCardProps {
  index: number;
  isSmall: boolean;
  title: string;
  description: string;
  materialType: string;
  language: string;
  tags: string[];
  time: string;
  users: string[];
}

const SearchCard = ({ isSmall, ...cardInfo }: SearchCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const theme = useTheme();
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <Box sx={{ perspective: "1000px", width: "100%", height: "20vh" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transition: "transform 0.8s",
          transformStyle: "preserve-3d",
          cursor: "pointer",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        <Card
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            p: isSmall ? 1.5 : 2,
            boxShadow: theme.shadows[3],
            backgroundColor: '#1A1A1A',
            zIndex: flipped ? 0 : 1,
          }}
        >
          <Box display="flex" alignItems="flex-start">
            <ArticleIcon sx={{
              color: theme.palette.primary.main,
              fontSize: 40,
              mr: 2,
              flexShrink: 0
            }} />
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                noWrap
                sx={{ fontSize: isSmall ? "1.2rem" : "1.5rem", width: "95%" }}
              >
                {cardInfo.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.primary"
                mt={0.5}
                sx={{ fontSize: isSmall ? "0.875rem" : "1rem", overflowY: "auto", height: "3rem", width: "95%" }}
              >
                {cardInfo.description}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ my: 1.5, overflowX: "auto", overflowY: "hidden" }}>
            {cardInfo.tags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: "auto"
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  mr: 1,
                  backgroundColor: theme.palette.secondary.main
                }}
              >
                U
              </Avatar>
              <Typography variant="body2" sx={{ overflowX: "auto" }}>{cardInfo.users[0]}</Typography>
            </Box>
            <Typography variant="caption" fontWeight="bold">
              {cardInfo.language}
            </Typography>
          </Box>
        </Card>
        
        <Card
          sx={{
            position: "absolute",
            width: "100%",
            minHeight: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            display: "flex",
            flexDirection: "column",
            p: isSmall ? 1.5 : 2,
            backgroundColor: '#1A1A1A',
            color: "white",
            boxShadow: theme.shadows[3],
            zIndex: flipped ? 1 : 0,
          }}
        >
          <Box display="flex" flexDirection="column" gap={1}>
            <Button sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.text.secondary, '&:hover': { backgroundColor: '#05DF88' } }}>
              <Typography fontWeight="bold">View set</Typography>
            </Button>
            <Box display={"flex"} flexDirection={"row"} bgcolor={'#222'} gap={1}>
              <Button fullWidth sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.text.secondary, '&:hover': { backgroundColor: '#05DF88' } }}>
                <Typography fontWeight="bold">Copy set</Typography>
              </Button>
              <Button fullWidth sx={{ bgcolor: theme.palette.secondary.main, color: theme.palette.text.secondary, '&:hover': { backgroundColor: '#05DF88' } }}>
                <Typography fontWeight="bold">Subscribe to set</Typography>
              </Button>
            </Box>
            <Button onClick={handleFlip} sx={{ bgcolor: '#EE5555', color: theme.palette.text.secondary, '&:hover': { backgroundColor: '#EE4444' } }}>
              <Typography fontWeight="bold">Cancel</Typography>
            </Button>
          </Box>
          <Divider sx={{ my: 1, backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Typography variant="caption">
              Created: {cardInfo.time}
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default SearchCard;