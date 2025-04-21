import { Link as MuiLink, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/UseAuthForm';

export const ForgotPasswordLink = () => {
  const { activeTab } = useAuth();

  if (activeTab !== 0) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
      <MuiLink
        component={RouterLink}
        to="/auth/password-reset"
        sx={{
          color: '#00e676',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'underline' },
          cursor: 'pointer'
        }}
      >
        Forgot password?
      </MuiLink>
    </Box>
  );
};
