import { Box, Container, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import theme from '../theme';

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const textData = [
  { name: '14 мая', added: random(1, 10), finished: random(1, 10) },
  { name: '15 мая', added: random(1, 10), finished: random(1, 10) },
  { name: '16 мая', added: random(1, 10), finished: random(1, 10) },
  { name: '17 мая', added: random(1, 10), finished: random(1, 10) },
  { name: '18 мая', added: random(1, 10), finished: random(1, 10) },
];

const setData = [
  { name: '14 мая', added: random(1, 10), finished: random(1, 10) },
  { name: '15 мая', added: random(1, 10), finished: random(1, 10) },
  { name: '16 мая', added: random(1, 10), finished: random(1, 10) },
  { name: '17 мая', added: random(1, 10), finished: random(1, 10) },
  { name: '18 мая', added: random(1, 10), finished: random(1, 10) },
];

const Progress = () => {
  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h3" sx={{ 
          color: theme.palette.secondary.main, 
          fontWeight: theme.typography.h3.fontWeight,
          lineHeight: theme.typography.h3.lineHeight,
          fontSize: theme.typography.h3.fontSize
        }}>
          Прогресс
        </Typography>
      </Box>

      <Box mt={4} display="flex" alignItems="center" gap={4}>
        <Box width={200}>
          <Typography variant="h5" textAlign="center">Статистика по текстам</Typography>
        </Box>
        <Box flex={1} height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={textData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend payload={[{ value: 'Добавлено', type: 'line', color: '#1976d2' }, { value: 'Закончено', type: 'line', color: '#25FFA8' }]} />
              <Line type="monotone" dataKey="added" stroke="#1976d2" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="finished" stroke="#25FFA8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Box mt={4} display="flex" alignItems="center" gap={4}>
        <Box width={200}>
          <Typography variant="h5" textAlign="center">Статистика по сетам</Typography>
        </Box>
        <Box flex={1} height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={setData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend payload={[{ value: 'Добавлено', type: 'line', color: '#1976d2' }, { value: 'Выполнено тестов', type: 'line', color: '#25FFA8' }]} />
              <Line type="monotone" dataKey="added" stroke="#1976d2" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="finished" stroke="#25FFA8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Container>
  );
}

export default Progress;