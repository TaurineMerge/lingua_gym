import { Box, Card, Container, TextField, Typography, Button, Divider } from "@mui/material";

const SetExercisePage = () => {
    return (
        <>
            {[
            { top: '30%', left: '5%', size: 40, rotate: 15, opacity: 0.08 },
            { top: '20%', right: '15%', size: 30, rotate: -25, opacity: 0.06 },
            { bottom: '15%', left: '10%', size: 50, rotate: 45, opacity: 0.1 },
            { bottom: '10%', right: '20%', size: 35, rotate: 60, opacity: 0.07 },
            { top: '35%', left: '40%', size: 60, rotate: -10, opacity: 0.05 },
            { bottom: '30%', right: '35%', size: 45, rotate: 30, opacity: 0.08 },
            ].map((triangle, index) => (
            <Box
                key={index}
                sx={{
                position: 'absolute',
                width: 0,
                height: 0,
                borderLeft: `${triangle.size}px solid transparent`,
                borderTop: `${triangle.size}px solid rgba(10,140,255,${triangle.opacity})`,
                transform: `rotate(${triangle.rotate}deg)`,
                zIndex: 0,
                pointerEvents: 'none',
                ...('top' in triangle ? { top: triangle.top } : {}),
                ...('bottom' in triangle ? { bottom: triangle.bottom } : {}),
                ...('left' in triangle ? { left: triangle.left } : {}),
                ...('right' in triangle ? { right: triangle.right } : {}),
                }}
            />
            ))}

            <Box
                sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `repeating-linear-gradient(
                    45deg,
                    rgba(10,140,255,0.015),
                    rgba(10,140,255,0.015) 1px,
                    transparent 1px,
                    transparent 12px
                )`,
                zIndex: 0,
                }}
            />

            <Box
                sx={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, rgba(10,140,255,0.02), transparent 75%)',
                transform: 'rotate(15deg)',
                zIndex: 0,
                }}
            />

            <Container
                maxWidth="md"
                sx={{
                    height: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{ mb: 3, zIndex: 1 }}>
                    <Typography variant="h4" align="center" color="#0A8CFF" gutterBottom>
                        Составьте предложение
                    </Typography>
                    <Typography variant="subtitle1" align="center" sx={{ opacity: 0.8 }}>
                        Ответьте на вопрос, используя слова из сета.
                    </Typography>
                </Box>

                <Card
                    elevation={6}
                    sx={{
                        bgcolor: '#1A1A1A',
                        color: '#FFFFFF',
                        p: 4,
                        borderRadius: 4,
                        width: '100%',
                        maxWidth: '700px',
                        height: '60%',
                    }}
                >
                    <Box sx={{ mb: 4, height: '30%', overflowY: 'auto' }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            What does the curious fox do when the moon rises?
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 4, bgcolor: '#0A8CFF' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(70% - 4 * 8)' }}>
                        <TextField
                            label="Ваш ответ"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                sx: {
                                    bgcolor: '#1E1E1E',
                                    borderRadius: 2,
                                    color: '#fff',
                                    fontSize: '1.5rem',
                                    overflowY: 'auto',
                                    p: 1.5,
                                },
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: '#ccc',
                                },
                            }}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                alignSelf: 'flex-end',
                                mt: 3,
                                bgcolor: '#3f51b5',
                                ':hover': { bgcolor: '#303f9f' },
                                borderRadius: 2,
                                textTransform: 'none',
                            }}
                        >
                            Отправить
                        </Button>
                    </Box>
                </Card>
            </Container>
        </>
    );
};

export default SetExercisePage;
