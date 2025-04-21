import { TextField } from '@mui/material';
import { useAuth } from '../../hooks/auth/UseAuthForm';

export const DisplayNameField = () => {
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
      label="Display name"
      name="displayName"
      autoComplete='off'
      value={formData.displayName}
      onChange={handleChange}
      error={!!errors.displayName && touched.displayName}
      helperText={touched.displayName ? errors.displayName : ''}
      sx={{
        mb: 2,
        input: { color: 'white' },
        label: { color: errors.displayName && touched.displayName ? 'error.main' : 'gray' },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { 
            borderColor: errors.displayName && touched.displayName ? 'error.main' : '#333' 
          },
          '&:hover fieldset': { 
            borderColor: errors.displayName && touched.displayName ? 'error.main' : '#888' 
          },
          '&.Mui-focused fieldset': { 
            borderColor: errors.displayName && touched.displayName ? 'error.main' : '#00e676' 
          },
        },
      }}
    />
  );
};