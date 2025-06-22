import { useState } from "react";
import { Box, Card, Typography, Avatar, Chip, useTheme, Button, Rating } from "@mui/material";
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
  rating: string;
  access: string;
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
            justifyContent: "space-between",
            p: isSmall ? 1 : 1.2,
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
                sx={{ fontSize: isSmall ? "1rem" : "1.3rem", width: "95%" }}
              >
                {cardInfo.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.primary"
                mt={0.5}
                sx={{ fontSize: isSmall ? "0.6rem" : "0.8rem", overflowY: "auto", height: "2.5rem", width: "95%" }}
              >
                {cardInfo.description}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Rating name="half-rating" defaultValue={Number.parseFloat(cardInfo.rating)} precision={0.5} readOnly sx={{ fontSize: isSmall ? "0.8rem" : "1rem" }} />
            <Typography variant="body2" sx={{ fontSize: isSmall ? "0.6rem" : "0.8rem", color: '#aaa' }}>{cardInfo.access}</Typography>
          </Box>

          <Box sx={{ overflowX: "auto", overflowY: "hidden", mb: 1 }}>
            {cardInfo.tags.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                size="small"
                sx={{ mr: 0.5, fontSize: isSmall ? "0.6rem" : "0.8rem" }}
              />
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 18,
                  height: 18,
                  mr: 1,
                  backgroundColor: theme.palette.secondary.main
                }}
              >
                {cardInfo.users[0].charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ overflowX: "auto", fontSize: isSmall ? "0.7rem" : "0.8rem" }}>{cardInfo.users[0]}</Typography>
            </Box>
            <Typography variant="caption" fontWeight="bold">
              {cardInfo.language}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Typography variant="caption" fontSize={isSmall ? "0.6rem" : "0.8rem"}>
              Создано: {cardInfo.time.slice(0, 10).split("-").reverse().join(".")}
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
            <Button sx={{ color: '#FFF', '&:hover': { backgroundColor: '#222' } }}>
              <Typography fontWeight="bold" fontSize={isSmall ? "0.6rem" : "0.8rem"}>Подробнее</Typography>
            </Button>
            <Button fullWidth sx={{ color: '#FFF', '&:hover': { backgroundColor: '#222' } }}>
              <Typography fontWeight="bold" fontSize={isSmall ? "0.6rem" : "0.8rem"}>Копировать сет</Typography>
            </Button>
            <Button fullWidth sx={{ color: '#FFF', '&:hover': { backgroundColor: '#222' } }}>
              <Typography fontWeight="bold" fontSize={isSmall ? "0.6rem" : "0.8rem"}>Добавить по ссылке</Typography>
            </Button>
            <Button onClick={handleFlip} sx={{ color: '#FFF', '&:hover': { backgroundColor: '#222' } }}>
              <Typography fontWeight="bold" fontSize={isSmall ? "0.6rem" : "0.8rem"}>Отмена</Typography>
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default SearchCard;