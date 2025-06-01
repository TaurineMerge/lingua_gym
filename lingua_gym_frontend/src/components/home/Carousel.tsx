import { Box, Typography, IconButton, SliderProps } from '@mui/material';
import { CarouselCard } from '../components';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion, AnimatePresence } from 'framer-motion';
import { CardType } from '../../types/NewMaterials';

const dummyDataSets = [
  {
    title: `English for beavers`,
    description: 'Learn essential vocabulary for dam-building, wood-chewing, and social grumbling in the wetland bureaucracy. Ideal for semiaquatic engineers and aspiring forest diplomats.',
    username: 'log_master',
    rating: 4.9,
    tags: ['animals', 'nature', 'construction', 'english'],
    language: 'Eng',
    type: CardType.SET,
  },
  {
    title: `Français pour les Dramatiques`,
    description: 'Un recueil de mots pour ceux qui vivent intensément : les âmes sensibles, les cœurs brisés et les poètes de trottoir. Pour faire de chaque silence une scène et de chaque regard un adieu.',
    username: 'croissanttears',
    rating: 4.7,
    tags: ['émotion', 'théâtre', 'drame', 'existentialisme'],
    language: 'Fra',
    type: CardType.SET,
  },
  {
    title: `中文给社交忍者`,
    description: '精选词汇与短语，助你在聚会中优雅退场、在微信群中巧妙回避，以及在家族聚餐中存活下来而不被盘问婚姻状况。适合内向又不失锋芒的你。',
    username: '安静即王道',
    rating: 4.2,
    tags: ['礼貌', '人际', '模糊表达', '情绪管理'],
    language: 'Zh',
    type: CardType.SET,
  },
  {
    title: `Español para Telenovelas`,
    description: 'Un set de frases y palabras para vivir, amar, llorar y gritar como si el mundo fuera un episodio eterno. Ideal para almas intensas, secretos familiares y entradas dramáticas con viento en el cabello.',
    username: 'corazónpartido',
    rating: 3,
    tags: ['amor', 'secretos', 'pasión', 'familia'],
    language: 'Es',
    type: CardType.SET,
  },
  {
    title: `English for beavers`,
    description: 'Learn essential vocabulary for dam-building, wood-chewing, and social grumbling in the wetland bureaucracy. Ideal for semiaquatic engineers and aspiring forest diplomats.',
    username: 'log_master',
    rating: 4.9,
    tags: ['animals', 'nature', 'construction', 'english'],
    language: 'Eng',
    type: CardType.SET,
  },
];

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