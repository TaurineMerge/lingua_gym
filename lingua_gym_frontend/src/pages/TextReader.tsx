import { Container, Box, Pagination, Typography, Popper, Button, Dialog, DialogTitle, IconButton, DialogContent, Drawer, Tooltip, ListItemButton, ListItem, List, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { useRef, useState } from "react";
import LinearProgress from '@mui/material/LinearProgress';
import CloseIcon from '@mui/icons-material/Close';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import MenuIcon from '@mui/icons-material/Menu';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TranslateIcon from '@mui/icons-material/Translate';
import CollectionsIcon from '@mui/icons-material/Collections';
import NotesIcon from '@mui/icons-material/Notes';
import axios from "axios";

interface TranslationRequest {
    original: string;
    originalLanguageCode: string;
    targetLanguageCode: string;
    context?: string;
}

interface TranslationResponse {
    translatedText: string;
}

const TextReader = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [translatedText, setTranslatedText] = useState<string | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const selectedWordsIds = useRef<number[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);

    const highlightedParagraphRef = useRef<number[]>([]);

    const isDragging = useRef(false);
    const dragTimer = useRef<NodeJS.Timeout | null>(null);
    const dragStartIndex = useRef<number | null>(null);
    const dragEndIndex = useRef<number | null>(null);

    const text = `
Jake had always been good at reading between the lines — not the literal ones, like road signs or menus, but the invisible ones people scribble in conversation. Today, though, the lines were blurred.
It started with a call from his manager.
“We need to touch base later,” she said.
Jake froze. Was it a casual check-in, or was the ground about to shift beneath him? Last time she said that, someone was "let go" — which, ironically, meant they were held tightly by unemployment.
He tried to keep his head above water for the rest of the morning, juggling emails that “needed eyes,” documents that were “time-sensitive,” and a client who wanted to circle back to an idea they’d buried last quarter. Jake smiled, nodded, and played it by ear, though the tune made little sense.
During lunch, his colleague Mia dropped by and asked if he was still seeing Claire.
Jake blinked. “It’s complicated,” he said.
And wasn’t that a can of worms. “Seeing” could mean dating, could mean arguing, could mean bumping into someone emotionally you’ve been trying to avoid physically. Context, as always, was king.
Later that afternoon, his computer froze — just as he was about to save face on a messy spreadsheet. He muttered something unkind to the machine, which responded with silence. Technology always knew when to ghost him.
At the 4 PM meeting, the room was stiff. His manager smiled the kind of smile that had a knife tucked behind it.
“Let’s get something on the table,” she said.
Jake panicked — which thing? The budget cuts? His performance? Or the time he "borrowed" that company mug with no intent of return?
But she was just talking about the new campaign.
Relief washed over him like a bucket of cold water — startling but cleansing.
The day wrapped up with a pat on the back and a “Let’s touch base again next week,” which now sounded less like a threat and more like a formality. Maybe. Maybe not.
As he walked home, Jake thought about language — how one phrase can open doors, or quietly close them behind you. How “I’m fine” can mean “I’m falling apart,” and how “We’ll be in touch” might mean you’ll never hear
`;
    const words = text.match(/\S+|\s+/g) || [];

    const sendTranslationRequest = async (requestData: TranslationRequest, isContextTranslation: boolean = false): Promise<TranslationResponse> => {
        setIsTranslating(true);
        try {
            const apiClient = axios.create({
                baseURL: 'http://localhost:3000/api/text',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const response = await apiClient.post<TranslationResponse>(isContextTranslation ? '/translate-context' : '/translate', requestData);
            return response.data;
        } catch (error) {
            console.error('Translation error:', error);
            throw error;
        } finally {
            setIsTranslating(false);
        }
    };

    const handleTranslation = async (isContextTranslation: boolean) => {
        if (selectedWordsIds.current.length === 0) return;
        
        const selectedText = selectedWordsIds.current
            .map(id => words[id])
            .join('')
            .trim();
        
        if (!selectedText) return;

        if (!isContextTranslation) {
            const translationRequest: TranslationRequest = {
                original: selectedText,
                originalLanguageCode: 'en',
                targetLanguageCode: 'ru'
            };
            try {
                const response = await sendTranslationRequest(translationRequest, isContextTranslation);
                setTranslatedText(response.translatedText);
            } catch {
                setTranslatedText("Error occurred during translation");
            }
            return;
        } else {
            const translationRequest: TranslationRequest = {
                original: selectedText,
                originalLanguageCode: 'en',
                targetLanguageCode: 'ru',
                context: highlightedParagraphRef.current.length > 0 
                    ? highlightedParagraphRef.current.map(id => words[id]).join('').trim()
                    : undefined
            };
            
            try {
                const response = await sendTranslationRequest(translationRequest, isContextTranslation);
                setTranslatedText(response.translatedText);
                
                if (anchorEl) {
                    setAnchorEl(anchorEl);
                }
            } catch {
                setTranslatedText("Error occurred during translation");
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();

        if ((e.target as HTMLElement).innerText.trim() === '') {
            return;
        }
        
        const target = e.target as HTMLElement;
        const index = Number(target.dataset.index);
        
        if (!selectedWordsIds.current.includes(index) || selectedWordsIds.current.length !== 1) {
            highlightedParagraphRef.current = [];
            selectedWordsIds.current = [];
            setAnchorEl(null);
            setTranslatedText(null);
        }

        if (!isNaN(index)) {
            dragStartIndex.current = index;
            dragEndIndex.current = index;
        }
    
        dragTimer.current = setTimeout(() => {
            isDragging.current = true;
        }, 200);
    };    

    const handleMouseUp = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).innerText.trim() !== '') {
            if (dragTimer.current) {
                clearTimeout(dragTimer.current);
                dragTimer.current = null;
            }
            
            if (!isDragging.current) {
                const target = e.target as HTMLElement;
                const index = Number(target.dataset.index);
                
                if (!isNaN(index)) {
                  if (selectedWordsIds.current.includes(index)) {
                    highlightedParagraphRef.current = [];
                    selectedWordsIds.current = [];
                    setAnchorEl(null);
                    setTranslatedText(null);
                  } else {
                    selectedWordsIds.current = [index];
                    setAnchorEl(target);
                    handleTranslation(false);
                  }
                }
            } else {
                const [start, end] = [dragStartIndex.current, dragEndIndex.current].sort((a, b) => a !== null && b !== null ? a - b : 0);
                if (start !== null && end !== null) {
                    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
                    selectedWordsIds.current = range;
                    setAnchorEl(e.target as HTMLElement);
                    handleTranslation(true);
                }
            }
        }             
    
        isDragging.current = false;
        dragStartIndex.current = null;
        dragEndIndex.current = null;
    };
    

    const handleMouseEnter = (id: number) => {
        if (isDragging.current && dragStartIndex.current !== null) {
            dragEndIndex.current = id;
            const [start, end] = [dragStartIndex.current, dragEndIndex.current].sort((a, b) => a - b);
            const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
            selectedWordsIds.current = range;
        }
    };

    const handleClosePopper = () => {
        highlightedParagraphRef.current = [];
        selectedWordsIds.current = [];
        setAnchorEl(null);
        setTranslatedText(null);
    }

    const isSentenceEnd = (word: string) => {
        return /[.!?]\s*$/.test(word);
    };

    const handleContextTranslation = () => {
        if (selectedWordsIds.current.length === 0) return;

        if (highlightedParagraphRef.current.length > 0) {
            highlightedParagraphRef.current = [];
            return;
        }

        let start = Math.min(...selectedWordsIds.current);
        let end = Math.max(...selectedWordsIds.current);
        
        while (start > 0 && !isSentenceEnd(words[start - 1])) {
            start--;
        }
        
        while (end < words.length && !isSentenceEnd(words[end])) {
            end++;
        }
        
        let sentencesBefore = 0;
        while (sentencesBefore < 2 && start > 0) {
            let newStart = start - 1;
            while (newStart > 0 && !isSentenceEnd(words[newStart - 1])) {
                newStart--;
            }
            
            if (newStart < start) {
                start = newStart;
                sentencesBefore++;
            } else {
                break;
            }
        }
        
        let sentencesAfter = 0;
        while (sentencesAfter < 2 && end < words.length) {
            let newEnd = end + 1;
            while (newEnd < words.length && !isSentenceEnd(words[newEnd])) {
                newEnd++;
            }
            
            if (newEnd > end) {
                end = newEnd;
                sentencesAfter++;
            } else {
                break;
            }
        }
        
        start = Math.max(0, start);
        end = Math.min(words.length - 1, end);
        
        const paragraphRange = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        highlightedParagraphRef.current = paragraphRange;
        
        handleTranslation(true);
    }

    const menuItems = [
        {
            title: "Bookmarks",
            icon: <BookmarkIcon />,
            action: () => console.log("Bookmarks clicked")
        },
        {
            title: "Translations",
            icon: <TranslateIcon />,
            action: () => console.log("Translations clicked")
        },
        {
            title: "Notes",
            icon: <NotesIcon />,
            action: () => console.log("Notes clicked")
        },
        {
            title: "Set",
            icon: <CollectionsIcon />,
            action: () => console.log("Collections clicked")
        },
    ];

    const renderText = () => {
        return (
            <>
                {words.map((word, i) => {
                    const isWord = /\S+/.test(word);
                    const selected = selectedWordsIds.current.includes(i);
                    const inHighlightedParagraph = highlightedParagraphRef.current.includes(i);
    
                    const isSpaceBetweenSelected =
                        !isWord &&
                        selectedWordsIds.current.includes(i - 1) &&
                        selectedWordsIds.current.includes(i + 1);
    
                    const highlight = selected || isSpaceBetweenSelected;
                    
                    const wordSpan = (
                        <span
                            key={i}
                            className={`word ${highlight ? 'selected' : ''}`}
                            onClick={undefined}
                            data-index={i}
                            onMouseEnter={isWord ? () => handleMouseEnter(i) : undefined}
                            style={{
                                backgroundColor: highlight 
                                    ? '#0034AF' 
                                    : inHighlightedParagraph 
                                        ? 'rgba(0, 52, 175, 0.3)'
                                        : 'transparent',
                                padding: '2px',
                                cursor: isWord ? (isDragging.current ? 'text' : 'pointer') : 'default',
                            }}
                        >
                            {word}
                        </span>
                    )

                    return (
                        wordSpan
                    );
                })}
            </>
        );
    };

    return (
        <Box display='flex' width='100%'>
            <Drawer
                variant="permanent"
                anchor="left"
                open={menuOpen}
                onClose={toggleMenu}
                sx={{
                    width: menuOpen ? 240 : 56,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: menuOpen ? 240 : 56,
                        height: '90vh',
                        top: '10vh',
                        boxSizing: 'border-box',
                        backgroundColor: '#111',
                        color: '#EEE',
                        borderRight: '1px solid #333',
                        transition: 'width 0.3s ease',
                        overflowX: 'hidden',
                    },
                }}
            >
                <List>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            onClick={toggleMenu}
                            sx={{
                                minHeight: 48,
                                justifyContent: menuOpen ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: menuOpen ? 3 : 'auto',
                                    justifyContent: 'center',
                                    color: '#0A84FF',
                                }}
                            >
                                <MenuIcon />
                            </ListItemIcon>
                            <ListItemText primary="Menu" sx={{ opacity: menuOpen ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <Divider sx={{ borderColor: '#333', my: 1 }} />
                    
                    {menuItems.map((item, index) => (
                        <Tooltip key={index} title={!menuOpen ? item.title : ''} placement="right">
                            <ListItem disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    onClick={item.action}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: menuOpen ? 'initial' : 'center',
                                        px: 2.5,
                                        '&:hover': {
                                            backgroundColor: '#2a2a2a',
                                        }
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: menuOpen ? 3 : 'auto',
                                            justifyContent: 'center',
                                            color: '#AAA',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={item.title} 
                                        sx={{ 
                                            opacity: menuOpen ? 1 : 0,
                                            '& .MuiTypography-root': {
                                                fontSize: '0.9rem',
                                            }
                                        }} 
                                    />
                                </ListItemButton>
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
            </Drawer>
            <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '90vh', width: '100vw' }}>
                <Box sx={{ height: '80vh', width: '100%', backgroundColor: 'transparent', borderRadius: '20px', overflowY: 'auto', overflowX: 'hidden', border: '2px solid #111' }}>
                    <Typography 
                    sx={{ textAlign: 'justify', color: '#DDD', cursor: 'text', fontSize: '1.2rem', lineHeight: '1.8rem', userSelect: 'none', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} 
                    ref={containerRef} 
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}>
                        {renderText()}
                    </Typography>
                </Box>
                <Box sx={{ width: '100%', height: '5vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography sx={{ color: '#FFFFFF', fontSize: '1rem', textAlign: 'center' }}>Завершено на: {Number.parseFloat(''+((page/totalPages)*100).toFixed(1))}%</Typography>
                    <LinearProgress value={(page/totalPages)*100} variant="determinate" color="primary" />
                </Box>
                <Box sx={{ height: '5vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Pagination count={totalPages} page={page} variant="outlined" color="primary" />
                </Box>
                <Popper
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    placement="bottom"
                    modifiers={[{ name: 'offset', options: { offset: [0, 12] } }]}
                >
                    <Box
                        sx={{
                            background: 'rgba(30, 30, 30, 0.95)',
                            borderRadius: 2,
                            padding: 2,
                            minWidth: 240,
                            maxWidth: 320,
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                            border: '1px solid #2a2a2a',
                            backdropFilter: 'blur(6px)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            transition: 'all 0.3s ease-in-out',
                        }}
                    >
                        <Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                p='0.5rem'
                                m='0.5rem 0'
                                sx={{
                                    border: '1px solid rgb(42, 94, 147)',
                                    borderRadius: 1,
                                    textAlign: 'justify',
                                    height: '7rem',
                                    overflowY: 'auto',
                                }}
                            >
                                {isTranslating ? (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <Typography>Осуществляется перевод...</Typography>
                                    </Box>
                                ) : (
                                    <Typography
                                        sx={{
                                            color: '#EEE',
                                            fontSize: '1rem',
                                            fontStyle: 'italic',
                                            wordBreak: 'break-word',
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {translatedText || "Select text to translate"}
                                    </Typography>
                                )}
                            </Box>
                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                sx={{
                                    alignSelf: 'flex-end',
                                }}>
                                <IconButton
                                    onClick={handleOpenDialog}
                                    sx={{
                                        color: '#0A84FF',
                                        textTransform: 'none',
                                        fontSize: '0.85rem',
                                        '&:hover': { textDecoration: 'underline' },
                                    }}
                                >
                                    <AspectRatioIcon sx={{ height: '1rem', width: '1rem' }} />
                                </IconButton>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: 1.5,
                            }}
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#0A84FF',
                                    color: '#FFF',
                                    fontWeight: 500,
                                    paddingX: 2,
                                    borderRadius: 1,
                                    '&:hover': { backgroundColor: '#006FE0' },
                                }}
                            >
                                Добавить в связанный сет
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: '#555',
                                    color: '#FFF',
                                    fontWeight: 500,
                                    paddingX: 2,
                                    borderRadius: 1,
                                    '&:hover': { backgroundColor: '#333', borderColor: '#777' },
                                }}
                            >
                                Дополнительные настройки
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleContextTranslation}
                                sx={{
                                    borderColor: '#555',
                                    color: '#FFF',
                                    fontWeight: 500,
                                    paddingX: 2,
                                    borderRadius: 1,
                                    '&:hover': { backgroundColor: '#333', borderColor: '#777' },
                                }}
                            >
                                Перевести в контексте
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleClosePopper}
                                sx={{
                                    color: '#FFF',
                                    borderColor: '#555',
                                    fontWeight: 500,
                                    paddingX: 2,
                                    borderRadius: 1,
                                    '&:hover': { backgroundColor: '#333', borderColor: '#777' },
                                }}
                            >
                                Отмена
                            </Button>
                        </Box>
                    </Box>
                </Popper>
                <Dialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        sx: {
                            backgroundColor: '#1e1e1e',
                            color: '#EEE',
                            border: '1px solid #444',
                            borderRadius: 2,
                        }
                    }}
                >
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#0A84FF' }}>
                        Полный перевод
                        <IconButton onClick={handleCloseDialog} sx={{ color: '#AAA' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Typography
                            sx={{
                                fontSize: '1.1rem',
                                fontStyle: 'italic',
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {translatedText}
                        </Typography>
                    </DialogContent>
                </Dialog>
            </Container>
        </Box>
    );
}

export default TextReader;