import { Box, Typography, IconButton, SliderProps } from '@mui/material';
import { CarouselCard } from '../components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion, AnimatePresence } from 'framer-motion';
import { CardType } from '../../types/NewMaterials';

const dummyDataSets = new Array(10).fill(null).map((_, idx) => ({
  title: `Set Title ${idx + 1}`,
  description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
  username: 'UserName',
  rating: Math.floor(Math.random() * 6),
  tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8'],
  language: 'Eng',
  type: CardType.SET,
}));

const dummyDataTexts = new Array(10).fill(null).map((_, idx) => ({
  title: `Text Title ${idx + 1}`,
  description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
  username: 'UserName',
  rating: Math.floor(Math.random() * 6),
  tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8'],
  language: 'Eng',
  type: CardType.TEXT,
}));

const SampleNextArrow = ({ onClick, currentSlide, slideCount }: SliderProps & { slideCount?: number, currentSlide?: number }) => {
  return (
    <IconButton
      onClick={onClick}
      disabled={currentSlide === (slideCount || 0) - 1}
      title=' arrow'
      sx={{
        position: 'absolute',
        right: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        color: '#E5E5E7',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
        '&:disabled': {
          opacity: 0.3,
          cursor: 'not-allowed'
        }
      }}
    >
      <ArrowForwardIosIcon />
    </IconButton>
  );
};

const SamplePrevArrow = ({ onClick, currentSlide }: SliderProps & { slideCount?: number, currentSlide?: number }) => {
  return (
    <IconButton
      onClick={onClick}
      disabled={currentSlide === 0}
      title='prev arrow'
      sx={{
        position: 'absolute',
        left: '-40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1,
        color: '#E5E5E7',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
        '&:disabled': {
          opacity: 0.3,
          cursor: 'not-allowed'
        }
      }}
    >
      <ArrowBackIosNewIcon />
    </IconButton>
  );
};

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 3,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
      },
    },
  ],
};

const Carousel = ({ tabValue, title }: { tabValue: number, title: string }) => {
  const data = tabValue === 0 ? dummyDataSets : dummyDataTexts;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" color="#E5E5E7">{title}</Typography>
        <Typography
          variant="body2"
          color="primary"
          mt={6}
          sx={{
            cursor: 'pointer',
            padding: '4px',
            transition: 'all 0.3s ease',
            fontSize: '1.2rem',
            alignSelf: 'end',
            "&:hover": {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '4px'
            }
          }}
        >
          Посмотреть все
        </Typography>
      </Box>

      <Box position="relative">
        <Box sx={{ overflow: 'visible', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tabValue}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              style={{ position: 'relative', overflow: 'visible' }}
            >
              <Slider {...settings}>
                {data.map((item, idx) => (
                  <CarouselCard key={idx} {...item} />
                ))}
              </Slider>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </>
  );
};

export default Carousel;