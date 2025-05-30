import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Container, Divider, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import theme from "../theme";
import { useParams } from "react-router-dom";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Card {
    cardId: string;
    original: string;
    transcription?: string | null;
    pronunciation: string;
    translations: string[];
    meanings: string[];
    examples: string[];
}

const SetPage = () => {
    const { setId } = useParams();
    const cards: Card[] = [
        {
            cardId: '1',
            original: 'Hello',
            transcription: 'Hello',
            pronunciation: 'Hello',
            translations: ['Привет'],
            meanings: ['Привет'],
            examples: ['Привет'],
        },
        {
            cardId: '2',
            original: 'World',
            transcription: 'World',
            pronunciation: 'World',
            translations: ['Мир'],
            meanings: ['Мир'],
            examples: ['Мир'],
        }
    ];

    return (
        <Container sx={{ overflowY: 'auto', overflowX: 'hidden', width: '80%' }}>
            <Box mt={4} display="flex" alignItems="center" justifyContent="space-between">
				<Typography variant="h3" sx={{ 
				color: theme.palette.secondary.main, 
				fontWeight: theme.typography.h3.fontWeight,
				lineHeight: theme.typography.h3.lineHeight,
				fontSize: theme.typography.h3.fontSize
				}}>
                    { setId }
				</Typography>
			</Box>
            <Stack direction="row" justifyContent='center' mt={4} mb={1} spacing={2}>
                <Button>
                    <Typography>Упражнения</Typography>
                </Button>
                <Button>
                    <Typography>Тест</Typography>
                </Button>
                <Button>
                    <Typography>Карточки</Typography>
                </Button>
            </Stack>
            <Divider />
            <Box>
                <List>
                    { cards.map((card, index) => (
                        <ListItem key={index}>
                            <Accordion sx={{ width: '100%', bgcolor: '#111' }}>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel3-content"
                                id="panel3-header"
                                >
                                    <Box display="flex" gap={2} width="100%" alignItems="center" justifyContent="space-between">
                                        <TextField
                                            label="Original"
                                            id="standard-size-normal"
                                            defaultValue={card.original}
                                            variant="standard"
                                        />
                                        <TextField
                                            label="Transcription"
                                            id="standard-size-normal"
                                            defaultValue={card.transcription}
                                            variant="standard"
                                        />
                                        <Button variant="contained" startIcon={<VolumeUpIcon />}>Play</Button>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                                <AccordionActions>
                                    <Button>Cancel</Button>
                                    <Button>Agree</Button>
                                </AccordionActions>
                            </Accordion>
                            <Divider />
                        </ListItem>
                    ))} 
                </List>
            </Box>
        </Container>
    )
}

export default SetPage;