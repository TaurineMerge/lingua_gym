import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1C1C1E',
      paper: '#FFFFFF',
    },
    primary: {
      main: '#0A84FF',
    },
    secondary: {
      main: '#25FFA8',
    },
    text: {
      primary: '#E5E5E7',
      secondary: '#000000',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});
