import { Link, Box } from '@mui/material';
import { useAuth } from '../../hooks/auth/UseAuthForm';

export const ForgotPasswordLink = () => {
  const { activeTab } = useAuth();

  if (activeTab !== 0) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
      <Link 
        href="/forgot-password" 
        sx={{ 
          color: '#00e676',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
          cursor: 'pointer'
        }}
      >
        Forgot password?
      </Link>
    </Box>
  );
};