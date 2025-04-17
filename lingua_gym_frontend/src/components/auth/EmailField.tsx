import { useAuth } from '../../hooks/auth/UseAuthForm';
import { TextField } from '@mui/material';

export const EmailField = () => {
  const { formData, errors, touched, handleChange } = useAuth();
  
  return (
    <TextField
      fullWidth
      variant="outlined"
      label="Email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      error={!!errors.email && touched.email}
      helperText={touched.email ? errors.email : ''}
      sx={{
        mb: 2,
        input: { color: 'white' },
        label: { color: errors.email && touched.email ? 'error.main' : 'gray' },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { 
            borderColor: errors.email && touched.email ? 'error.main' : '#333' 
          },
          '&:hover fieldset': { 
            borderColor: errors.email && touched.email ? 'error.main' : '#888' 
          },
          '&.Mui-focused fieldset': { 
            borderColor: errors.email && touched.email ? 'error.main' : '#00e676' 
          },
        },
      }}
    />
  );
};