import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './contexts/AuthProvider';
import { RoutesWrapper } from './routes/RoutesWrapper';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId='589395398402-fmb11gso5s5fc5i2ded1sf60guae1nn8.apps.googleusercontent.com'>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <RoutesWrapper />
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);