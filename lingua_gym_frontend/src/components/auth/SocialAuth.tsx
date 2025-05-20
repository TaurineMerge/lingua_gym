import { Button } from '@mui/material';
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';

interface SocialAuthProps {
  icon?: React.ReactNode;
  text?: string;
}

export const SocialAuth = ({ 
  icon, 
  text = "Continue with Google" 
}: SocialAuthProps) => {
  //const { handleGoogleLogin } = useAuth();
  
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      const res = await fetch('http://localhost:3000/api/access_management/google/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: tokenResponse.access_token }),
      });

      const data = await res.json();
      console.log('Response:', data);
    },
    onError: () => console.log('Ошибка входа через Google'),
    flow: 'implicit',
  });

  return (
    <Button
      fullWidth
      variant="contained"
      onClick={() => login()} // вызывается без аргументов
      startIcon={icon}
      sx={{
        bgcolor: '#0d47a1',
        '&:hover': { bgcolor: '#1565c0' },
        color: 'white',
        mb: 2,
        textTransform: 'none',
      }}
    >
      {text}
    </Button>
  );
};