import { useState } from 'react';
import { Box, Tabs, Tab, TextField, Button, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function AuthTabs() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = (_: React.SyntheticEvent, newValue: number) => setTab(newValue);

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 10, bgcolor: '#1e1e1e', borderRadius: 4, p: 4, boxShadow: 3 }}>
      <Tabs
        value={tab}
        onChange={handleChange}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Log in" sx={{ color: 'white' }} />
        <Tab label="Sign up" sx={{ color: 'white' }} />
      </Tabs>

      <Button
        fullWidth
        variant="contained"
        onClick={handleGoogleLogin}
        startIcon={<GoogleIcon />}
        sx={{
          bgcolor: '#0d47a1',
          '&:hover': { bgcolor: '#1565c0' },
          color: 'white',
          mb: 2,
          textTransform: 'none',
        }}
      >
        Continue with Google
      </Button>

      <Typography variant="body2" sx={{ color: 'gray', textAlign: 'center', mb: 2 }}>
        or use your email
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          mb: 2,
          input: { color: 'white' },
          label: { color: 'gray' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#333' },
            '&:hover fieldset': { borderColor: '#888' },
            '&.Mui-focused fieldset': { borderColor: '#00e676' },
          },
        }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          mb: 3,
          input: { color: 'white' },
          label: { color: 'gray' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#333' },
            '&:hover fieldset': { borderColor: '#888' },
            '&.Mui-focused fieldset': { borderColor: '#00e676' },
          },
        }}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{
          bgcolor: '#00e676',
          color: '#000',
          textTransform: 'none',
          '&:hover': { bgcolor: '#1aff8c' },
        }}
      >
        {tab === 0 ? 'Log in' : 'Sign up'}
      </Button>
    </Box>
  );
}
