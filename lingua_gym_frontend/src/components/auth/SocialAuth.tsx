import { Button } from '@mui/material';
import { useAuth } from '../../hooks/auth/UseAuthForm';

interface SocialAuthProps {
  icon?: React.ReactNode;
  text?: string;
}

export const SocialAuth = ({ 
  icon, 
  text = "Continue with Google" 
}: SocialAuthProps) => {
  const { handleGoogleLogin } = useAuth();

  return (
    <Button
      fullWidth
      variant="contained"
      onClick={handleGoogleLogin}
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