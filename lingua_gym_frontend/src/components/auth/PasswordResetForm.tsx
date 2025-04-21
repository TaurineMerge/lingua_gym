import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { validateEmail, validatePassword } from '../../utils/auth/AuthValidators';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PasswordResetRequestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [resendTimer, setResendTimer] = useState<number>(0);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (message && token) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, token, navigate]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (!email) throw new Error('Email is required');
      if (validateEmail(email) !== '') throw new Error('Please enter a valid email');

      const res = await fetch('http://localhost:3000/api/access_management/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setResendTimer(30);
      } else throw new Error(data.error || 'Something went wrong');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unexpected error occurred');
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (!newPassword || !confirmPassword) throw new Error('All fields are required');
      if (newPassword !== confirmPassword) throw new Error('Passwords do not match');
      if (validatePassword(newPassword) !== '') throw new Error('Password is too weak');

      const res = await fetch('http://localhost:3000/api/access_management/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
      } else throw new Error(data.error || 'Something went wrong');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unexpected error occurred');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 8, p: 4, bgcolor: '#1e1e1e', borderRadius: 4, boxShadow: 3 }}>
      {token ? (
        <>
          <Typography variant="h5" gutterBottom>
            Set New Password
          </Typography>
          <form onSubmit={handleSetNewPassword}>
            <TextField
              label="New Password"
              fullWidth
              type="password"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={textFieldStyle}
            />
            <TextField
              label="Confirm Password"
              fullWidth
              type="password"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={textFieldStyle}
            />
            <Button type="submit" variant="contained" fullWidth sx={buttonStyle}>
              Set Password
            </Button>
          </form>
          {message && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                Redirecting to login page...
              </Typography>
            </Alert>
          )}
          <Button
            onClick={() => navigate('/login')}
            variant="text"
            fullWidth
            sx={{ mt: 1, color: '#00e676', textTransform: 'none' }}
          >
            Back to Login
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Reset Your Password
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
            Enter your email to receive a reset link.
          </Typography>
          <form onSubmit={handleRequestReset}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              sx={textFieldStyle}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={buttonStyle}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Send Reset Link'}
            </Button>
          </form>
          {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
          <Button
            onClick={() => navigate('/login')}
            variant="text"
            fullWidth
            sx={{ mt: 1, color: '#00e676', textTransform: 'none' }}
          >
            Back to Login
          </Button>
        </>
      )}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

const textFieldStyle = {
  input: { color: 'white' },
  label: { color: 'gray' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#333' },
    '&:hover fieldset': { borderColor: '#666' },
    '&.Mui-focused fieldset': { borderColor: '#00e676' },
  }
};

const buttonStyle = {
  bgcolor: '#00e676',
  color: '#000',
  textTransform: 'none',
  '&:hover': { bgcolor: '#1aff8c' },
  '&:disabled': { bgcolor: 'grey.700' },
  mt: 2
};

export default PasswordResetRequestPage;
