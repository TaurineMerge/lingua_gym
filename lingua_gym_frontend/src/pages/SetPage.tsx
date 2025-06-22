import { useEffect, useState } from 'react';
import {
  Accordion, AccordionActions, AccordionDetails, AccordionSummary,
  Box, Button, Container, Divider, Fab, List, ListItem, ListItemButton, ListItemText, Stack, Typography
} from "@mui/material";
import { useParams } from "react-router-dom";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ImageIcon from '@mui/icons-material/Image';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TagIcon from '@mui/icons-material/Tag';

interface example {
  example: string | null;
  translation: string | null;
}

interface Card {
  cardId: string;
  original: string;
  transcription?: string | null;
  pronunciation: string;
  translations: string[];
  meanings: string[];
  examples: example[];
  imageUrl?: string;
}

interface SetInfo {
  title: string;
  createdBy: string;
  rating: number;
  language: string;
  coverImageUrl?: string;
  isPublic: boolean;
  tags: string[];
  userAccess: 'owner' | 'editor' | 'viewer';
  cards: Card[];
}

const SetPage = () => {
  const { setName, setId } = useParams();
  const [set, setSet] = useState<SetInfo | null>(null);

  useEffect(() => {
    const fetchedSet: SetInfo = {
        title: '¡Exprésate!',
        createdBy: 'Verbivore9000',
        rating: 4.7,
        language: 'Испанский',
        coverImageUrl: '/public/set_image_example.png',
        isPublic: true,
        tags: ['spanish', 'grammar', 'vocabulary'],
        userAccess: 'owner',
        cards: [
            {
            cardId: '1',
            original: '¡Buenos días!',
            transcription: 'bwe.nos ˈdi.as',
            pronunciation: '',
            translations: ['Доброе утро'],
            meanings: ['Приветствие с утра', 'Вежливая форма начала разговора'],
            examples: [
                {
                example: '¡Buenos días, señor! ¿Cómo está usted?',
                translation: 'Доброе утро, сэр! Как дела?',
                },
            ],
            imageUrl: '/public/card_image_morning.avif',
            },
            {
            cardId: '2',
            original: '¿Qué pasa?',
            transcription: 'ke ˈpa.sa',
            pronunciation: '',
            translations: ['Что случилось?', 'Что происходит?'],
            meanings: ['Форма вопроса о происходящем', 'Дружелюбное приветствие'],
            examples: [
                {
                example: '¡Ey! ¿Qué pasa, tío?',
                translation: 'Эй! Что происходит, дружище?',
                },
                {
                example: '¿Qué pasa aquí? Todo está desordenado.',
                translation: 'Что тут случилось? Всё вверх дном.',
                },
            ],
            imageUrl: '/public/puzzled_cat.png',
            },
            {
            cardId: '3',
            original: 'Tengo hambre',
            transcription: 'ˈteŋ.go ˈam.bɾe',
            pronunciation: '',
            translations: ['Я голоден', 'Я хочу есть'],
            meanings: ['Указание на голод', 'Физиологическая потребность'],
            examples: [
                {
                example: 'Después de la caminata, todos decían: "Tengo hambre".',
                translation: 'После прогулки все говорили: "Я голоден".',
                },
            ],
            imageUrl: '',
            },
            {
            cardId: '4',
            original: 'No entiendo',
            transcription: 'no enˈtjen.do',
            pronunciation: '',
            translations: ['Я не понимаю'],
            meanings: ['Непонимание сказанного', 'Просьба о повторении'],
            examples: [
                {
                example: '¿Puedes repetir, por favor? No entiendo.',
                translation: 'Можешь повторить, пожалуйста? Я не понимаю.',
                },
            ],
            imageUrl: '',
            },
            {
            cardId: '5',
            original: '¡Hasta luego!',
            transcription: 'ˈas.ta ˈlwe.ɣo',
            pronunciation: '',
            translations: ['До скорого', 'Увидимся позже'],
            meanings: ['Прощание', 'Обещание встретиться снова'],
            examples: [
                {
                example: '— Me voy al trabajo. — ¡Hasta luego!',
                translation: '— Я ухожу на работу. — До скорого!',
                },
            ],
            imageUrl: '',
            },
        ],
    };
    setSet(fetchedSet);
  }, [setName]);

  const playPronunciation = (text: string) => {
    if (!window.speechSynthesis) {
      alert('Ваш браузер не поддерживает озвучивание');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (!set) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Container sx={{
      overflowY: 'auto',
      overflowX: 'hidden',
      height: '90vh',
      width: '80%',
      '&::-webkit-scrollbar': {
        width: '0.2em'
      },
      '&::-webkit-scrollbar-track': {
        border: '1px solid #000'
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#0A84FF',
      }
    }}>
      <Box
        mt={4}
        p={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#181818',
        }}
      >
        <Box display="flex" alignItems="center">
          {set.coverImageUrl ? (
            <Box
              component="img"
              src={set.coverImageUrl}
              sx={{ height: 150, width: 150, borderRadius: 2, objectFit: 'cover', mr: 2 }}
              alt={set.title}
            />
          ) : (
            <Box
              sx={{
                height: 150,
                width: 150,
                borderRadius: 2,
                mr: 2,
                backgroundColor: '#222',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ImageIcon sx={{ fontSize: 80, color: '#eee' }} />
            </Box>
          )}
          <Box>
            <Typography variant="h3" fontWeight={700} color='#25FFA8'>{set.title}</Typography>
            <List sx={{ display: 'flex', flexDirection: 'row' }}>
              {set.tags.map((tag) => (
                <ListItem key={tag} disablePadding>
                  <ListItemButton sx={{ mr: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TagIcon />
                    <ListItemText primary={tag} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ color: 'skyblue' }}>Автор: {set.createdBy}</Typography>
          <Typography variant="subtitle1" sx={{ color: 'skyblue' }}>Язык: {set.language}</Typography>
          <Typography variant="subtitle1" sx={{ color: 'skyblue' }}>Рейтинг: {set.rating.toFixed(1)} ⭐</Typography>
          <Typography variant="subtitle1" sx={{ color: 'skyblue' }}>Карточек: {set.cards.length}</Typography>
          <Typography variant="subtitle1" sx={{ color: 'skyblue' }}>
            Доступ: <span style={{ color: set.isPublic ? 'lightgreen' : 'tomato' }}>{set.isPublic ? '👁️ Публичный' : '🔒 Приватный'} ({set.userAccess})</span>
          </Typography>
        </Box>
      </Box>

      {set.userAccess === 'owner' && (
        <Box mt={2} p={2} bgcolor="#111" borderRadius={2}>
            <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" color="primary" onClick={() => alert('Упражнения в разработке')}>
                    Упражнения
                    </Button>
                    <Button variant="outlined" color="primary" onClick={() => alert('Тест в разработке')}>
                    Тест
                    </Button>
                    <Button variant="outlined" color="primary" onClick={() => alert('Карточки в разработке')}>
                    Карточки
                    </Button>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                    variant="outlined"
                    color="info"
                    size="small"
                    onClick={() => alert('Настройка прав доступа')}
                    startIcon={<span>🔐</span>}
                    >
                        Настроить права
                    </Button>
                    <Fab color="primary" aria-label="add" size="medium" onClick={() => alert('Добавить карточку')}>
                        <AddIcon />
                    </Fab>
                    <Fab color="error" aria-label="delete" size="medium" onClick={() => alert('Удалить сет')}>
                        <DeleteIcon />
                    </Fab>
                </Stack>
            </Stack>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <List>
        {set.cards.map((card) => (
          <ListItem key={card.cardId} sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 1)' }}>
            <Accordion sx={{
              width: '100%',
              bgcolor: '#111',
              color: 'white',
              backdropFilter: 'blur(6px)',
              borderRadius: 2,
              transition: '0.3s',
              '&:hover': {
                boxShadow: '0 0 10px rgba(0, 122, 255, 0.4)',
              }
            }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Box display='flex' gap={2} alignItems='center'>
                    {card.imageUrl ? (
                      <Box
                        component="img"
                        src={card.imageUrl}
                        sx={{ height: 100, width: 100, borderRadius: 2, objectFit: 'cover', mr: 2 }}
                        alt={card.original}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 100,
                          width: 100,
                          borderRadius: 2,
                          mr: 2,
                          backgroundColor: '#222',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <ImageIcon sx={{ fontSize: 50, color: '#eee' }} />
                      </Box>
                    )}
                    <Box>
                      <Typography variant="h6">{card.original}</Typography>
                      <Typography variant="body2" sx={{ color: 'gray' }}>
                        {card.translations[0]}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<VolumeUpIcon />}
                    onClick={() => playPronunciation(card.pronunciation)}
                  >
                    Воспроизвести
                  </Button>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Stack spacing={1}>
                  {card.transcription && (
                    <Typography><strong>Транскрипция:</strong> [{card.transcription}]</Typography>
                  )}
                  <Typography><strong>Перевод:</strong> {card.translations.join(', ')}</Typography>
                  <Typography><strong>Значения:</strong> {card.meanings.join('; ')}</Typography>
                  <Typography><strong>Примеры:</strong></Typography>
                  <ul>
                    {card.examples.map((ex, i) => <li key={i}><div>{ex.example}</div><div>{ex.translation}</div></li>)}
                  </ul>
                </Stack>
              </AccordionDetails>

              <AccordionActions>
                <Button color="secondary" sx={{ backgroundColor: '#1A1A1A' }} onClick={() => alert(`Редактировать карточку ${card.original}`)}>Редактировать</Button>
                <Button color="error" sx={{ backgroundColor: '#1A1A1A' }} onClick={() => alert(`Удалить карточку ${card.original}`)}>Удалить</Button>
              </AccordionActions>
            </Accordion>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default SetPage;
