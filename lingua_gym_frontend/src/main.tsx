import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from './theme.ts';
import { RouterProvider } from 'react-router-dom';
import routes from './routes/index.tsx';
import { AuthProvider } from './contexts/AuthProvider.tsx';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>  
                <RouterProvider router={routes} />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);