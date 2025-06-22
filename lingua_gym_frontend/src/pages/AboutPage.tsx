import { useState } from 'react';
import {
  Box, Button, Step, StepLabel, Stepper, Typography, Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Translate, FitnessCenter, Book, TrendingUp,
} from '@mui/icons-material';
import TopBar from '../components/main/TopBar';

const steps = [
  {
    label: 'Строй план обучения',
    description: 'Создавай собственные планы и расширяй словарный запас без лишних подсказок.',
    icon: <Book fontSize="large" color="info" />,
  },
  {
    label: 'Читай и изучай',
    description: 'Загружай тексты, выбирай слова и фразы, добавляй в словарь. Учись в контексте и с удовольствием.',
    icon: <Translate fontSize="large" color="info" />,
  },
  {
    label: 'Выполняй упражнения',
    description: 'Практикуйся с различными упражнениями: запомни, повторяй, тренируй навык до автоматизма.',
    icon: <FitnessCenter fontSize="large" color="info" />,
  },
  {
    label: 'Отслеживай прогресс',
    description: 'Веди учёт успехов и наблюдай, как твои знания расширяются день за днём.',
    icon: <TrendingUp fontSize="large" color="info" />,
  },
];

function AboutPage() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  return (
    <>
    <TopBar isExtended={false} />
    <Box
      sx={{
        backgroundColor: '#1A1A1A',
        height: '90vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2
      }}
    >
      <Box sx={{ overflow: 'hidden', position: 'absolute', bottom: 0, right: 0, zIndex: 1, pointerEvents: 'none' }}>
        <Box component='img' src="public/steps.png" sx={{ height: '1000px', opacity: 0.2, transform: 'rotate(-15deg) translate(50%, 70%)' }} />        
      </Box>
      <Typography variant="h3" align="center" color="#25FFA8" gutterBottom sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
        Добро пожаловать в <strong>LinguaGym</strong>
      </Typography>

      <Typography align="center" sx={{ mb: 4, fontStyle: 'italic', color: '#eee' }}>
        Твой путь к знаниям начинается здесь...
      </Typography>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          mb: 4,
          '.MuiStepLabel-label': { color: '#fff !important' },
          '.MuiStepLabel-root.Mui-active .MuiStepLabel-label': { fontWeight: 'bold', color: '#0A84FF !important' },
          '.MuiStepLabel-root.Mui-completed .MuiStepLabel-label': { color: '#eee !important' },
          '.MuiStepConnector-line': { borderColor: '#0A84FF' },
        }}
      >
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper
        elevation={6}
        component={motion.div}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{
          width: { xs: '90%', sm: '60%', md: '50%' },
          p: 5,
          borderRadius: 3,
          backgroundColor: '#1A1A1A',
          textAlign: 'center',
          boxShadow: '0 0 15px #0A84FF',
          zIndex: 2,
        }}
      >
        <Box display="flex" justifyContent="center" mb={3} sx={{ color: '#0A84FF' }}>
          {steps[activeStep].icon}
        </Box>
        <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
          {steps[activeStep].label}
        </Typography>
        <Typography variant="body1" sx={{ color: '#eee', fontWeight: 500 }}>
          {steps[activeStep].description}
        </Typography>
      </Paper>

      <Box display="flex" justifyContent="space-between" mt={5} sx={{ width: { xs: '90%', sm: '60%', md: '50%' } }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          sx={{
            color: '#eee',
            borderColor: '#0A84FF',
            '&:disabled': { color: '#555', borderColor: '#555' },
          }}
          variant="outlined"
        >
          Назад
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
          sx={{
            backgroundColor: '#0A84FF',
            '&:hover': { backgroundColor: '#0A84FF' },
          }}
        >
          Далее
        </Button>
      </Box>

      <Box mt={5} textAlign="center" sx={{ height: '2rem' }}>
        {activeStep === steps.length - 1 && (
          <Button
            variant="outlined"
            size="large"
            href="/register"
            sx={{
              color: '#25FFA8',
              borderColor: '#25FFA8',
              fontWeight: 'bold',
              px: 5,
              '&:hover': {
                backgroundColor: '#1A1A1A',
                borderColor: '#15CF88',
              },
            }}
          >
            Начать обучение
          </Button>
        )}
      </Box>
    </Box>
    </>
  );
}

export default AboutPage;
