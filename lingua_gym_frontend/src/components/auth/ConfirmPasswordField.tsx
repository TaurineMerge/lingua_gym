import { TextField } from '@mui/material';
import { useAuth } from '../../hooks/auth/UseAuthForm';

export const ConfirmPasswordField = () => {
  const { 
    activeTab,
    formData, 
    errors, 
    touched,
    handleChange 
  } = useAuth();

  if (activeTab !== 1) return null;

  return (
    <TextField
      fullWidth
      variant="outlined"
      label="Confirm Password"
      type="password"
      name="confirmPassword"
      autoComplete='off'
      value={formData.confirmPassword}
      onChange={handleChange}
      error={!!errors.confirmPassword && touched.confirmPassword}
      helperText={touched.confirmPassword ? errors.confirmPassword : ''}
      sx={{
        mb: 3,
        input: { color: 'white' },
        label: { color: errors.confirmPassword && touched.confirmPassword ? 'error.main' : 'gray' },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { 
            borderColor: errors.confirmPassword && touched.confirmPassword ? 'error.main' : '#333' 
          },
          '&:hover fieldset': { 
            borderColor: errors.confirmPassword && touched.confirmPassword ? 'error.main' : '#888' 
          },
          '&.Mui-focused fieldset': { 
            borderColor: errors.confirmPassword && touched.confirmPassword ? 'error.main' : '#00e676' 
          },
        },
      }}
    />
  );
};