import { Box, Container, MenuItem, Select, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import theme from '../theme';

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const textData = Array.from({ length: 25 }, (_, i) => ({
  name: `${i + 1} мая`,
  added: random(1, 10),
  finished: random(1, 10),
}));

const setData = Array.from({ length: 25 }, (_, i) => ({
  name: `${i + 1} мая`,
  added: random(1, 10),
  finished: random(1, 10),
}));

const Progress = () => {
  return (
    <Container>
      <Box mt={4} display="flex" justifyContent={"space-between"}>
        <Typography variant="h3" sx={{ 
          color: theme.palette.secondary.main, 
          fontWeight: theme.typography.h3.fontWeight,
          lineHeight: theme.typography.h3.lineHeight,
          fontSize: theme.typography.h3.fontSize
        }}>
          Прогресс
        </Typography>
        <Box mt={2} width={200}>
          <Select fullWidth value={'Текущий месяц'} onChange={() => {}}>
              <MenuItem key={1} value={'Текущий месяц'}>{'Текущий месяц'}</MenuItem>
          </Select>
        </Box>
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