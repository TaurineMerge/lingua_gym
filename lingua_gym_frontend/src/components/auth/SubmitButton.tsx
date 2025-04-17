import { Button } from '@mui/material';
import { useAuth } from '../../hooks/auth/UseAuthForm';

export const SubmitButton = () => {
  const { isSubmitting, activeTab, handleSubmit } = useAuth();

  return (
    <Button
      fullWidth
      variant="contained"
      onClick={handleSubmit}
      disabled={isSubmitting}
      sx={{
        bgcolor: '#00e676',
        color: '#000',
        textTransform: 'none',
        '&:hover': { bgcolor: '#1aff8c' },
        '&:disabled': { bgcolor: 'grey.700' },
      }}
    >
      {isSubmitting ? 'Processing...' : activeTab === 0 ? 'Sign In' : 'Sign Up'}
    </Button>
  );
};