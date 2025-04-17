import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1A1A1A',
      paper: '#2B2B2B',
    },
    primary: {
      main: '#0A84FF',
    },
    secondary: {
      main: '#25FFA8',
    },
    text: {
      primary: '#CFCFCF',
      secondary: '#000000',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    h3: {
      fontSize: '4rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    body2: {
      fontSize: '1.2rem',
      fontWeight: 600
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: '#1A1A1A',
          color: '#FFFFFF',
          overflowX: 'hidden',
        },
        '::-webkit-scrollbar': {
          height: '8px',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#444',
          borderRadius: '4px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          boxShadow: 'none',
          fontWeight: 600,
          padding: '8px 24px',
          fontSize: '1rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&.Mui-disabled': {
            opacity: 0.5,
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: '#0A84FF',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#0066CC',
            },
          },
        },
        {
          props: { variant: 'contained', color: 'secondary' },
          style: {
            backgroundColor: '#25FFA8',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#1AD991',
            },
          },
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {
            borderColor: '#0A84FF',
            color: '#0A84FF',
            '&:hover': {
              borderColor: '#0066CC',
              backgroundColor: 'rgba(10, 132, 255, 0.08)',
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          },
        },
        {
          props: { size: 'large' },
          style: {
            padding: '10px 28px',
            fontSize: '1.1rem',
          },
        },
        {
          props: { size: 'small' },
          style: {
            padding: '6px 16px',
            fontSize: '0.875rem',
          },
        },
      ],
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          fontWeight: 500,
          fontSize: '1rem',
          '&.Mui-selected': {
            color: '#FFFFFF',
            borderBottom: '2px solid #FFFFFF',
          },
        },
      },
    },
  },
});

export default theme;
