import { Button } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';

interface SocialAuthProps {
  icon?: React.ReactNode;
  text?: string;
}

export const SocialAuth = ({ 
  icon, 
  text = "Войти с помощью Google" 
}: SocialAuthProps) => {
  //const { handleGoogleLogin } = useAuth();
  
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const res = await fetch('http://localhost:3000/api/access_management/google/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: codeResponse.code }),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = data.redirectUrl;
      }
    },
    flow: 'auth-code',
    redirect_uri: 'http://localhost:3001'
  });


  return (
    <Button
      fullWidth
      variant="contained"
      onClick={() => login()}
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