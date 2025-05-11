import { Container, Box, Pagination, Typography, Popper } from "@mui/material";
import { useRef, useState } from "react";
import LinearProgress from '@mui/material/LinearProgress';

const TextReader = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedWordsIds, setSelectedWordsIds] = useState<number[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    
    const containerRef = useRef<HTMLDivElement>(null);

    const isDragging = useRef(false);
    const dragTimer = useRef<NodeJS.Timeout | null>(null);
    const dragStartIndex = useRef<number | null>(null);
    const dragEndIndex = useRef<number | null>(null);

    const text = 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain';
    
    const words = text.match(/\S+|\s+/g) || [];

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();

        if ((e.target as HTMLElement).innerText.trim() === '') {
            return;
        }
        
        const target = e.target as HTMLElement;
        const index = Number(target.dataset.index);
        
        if (!selectedWordsIds.includes(index) || selectedWordsIds.length !== 1) {
            setSelectedWordsIds([]);
            setAnchorEl(null);
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
                  if (selectedWordsIds.includes(index)) {
                    setSelectedWordsIds([]);
                    setAnchorEl(null);
                  } else {
                    setSelectedWordsIds([index]);
                    setAnchorEl(target);
                  }
                }
            } else {
                const [start, end] = [dragStartIndex.current, dragEndIndex.current].sort((a, b) => a !== null && b !== null ? a - b : 0);
                if (start !== null && end !== null) {
                    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
                    setSelectedWordsIds(range);
                    setAnchorEl(e.target as HTMLElement);
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
            setSelectedWordsIds(range);
        }
    };

    const renderText = () => {
        return (
            <>
                {words.map((word, i) => {
                    const isWord = /\S+/.test(word);
                    const selected = selectedWordsIds.includes(i);
    
                    const isSpaceBetweenSelected =
                        !isWord &&
                        selectedWordsIds.includes(i - 1) &&
                        selectedWordsIds.includes(i + 1);
    
                    const highlight = selected || isSpaceBetweenSelected;
                    
                    const wordSpan = (
                        <span
                            key={i}
                            className={`word ${highlight ? 'selected' : ''}`}
                            onClick={undefined}
                            data-index={i}
                            onMouseEnter={isWord ? () => handleMouseEnter(i) : undefined}
                            style={{
                                backgroundColor: highlight ? '#0034AF' : 'transparent',
                                padding: '2px',
                                cursor: isWord ? 'pointer' : 'default',
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
                <Typography sx={{ color: '#FFFFFF', fontSize: '1rem', textAlign: 'center' }}>Progress: {(totalPages/page)*100}%</Typography>
                <LinearProgress value={(totalPages/page)*100} variant="determinate" color="primary" />
            </Box>
            <Box sx={{ height: '5vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Pagination count={totalPages} page={page} variant="outlined" color="primary" />
            </Box>
            <Popper 
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="bottom"
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 10],
                        },
                    },
                ]}
            >
                <Box display={'flex'} flexDirection={'column'} sx={{ height: '100px', width: '100px', backgroundColor: '#111' }}>

                </Box>
            </Popper>
        </Container>
    );
}

export default TextReader;