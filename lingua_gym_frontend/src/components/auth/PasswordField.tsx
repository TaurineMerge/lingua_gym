import { TextField } from '@mui/material';
import { useAuth } from '../../hooks/auth/UseAuthForm';

export const PasswordField = () => {
  const { 
    activeTab,
    formData, 
    errors, 
    touched,
    handleChange 
  } = useAuth();

  return (
    <TextField
      fullWidth
      variant="outlined"
      label="Пароль"
      type="password"
      name="password"
      autoComplete='off'
      value={formData.password}
      onChange={handleChange}
      error={!!errors.password && touched.password}
      helperText={touched.password ? errors.password : ''}
      sx={{
        mb: activeTab === 0 ? 3 : 2,
        input: { color: 'white' },
        label: { color: errors.password && touched.password ? 'error.main' : 'gray' },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { 
            borderColor: errors.password && touched.password ? 'error.main' : '#333' 
          },
          '&:hover fieldset': { 
            borderColor: errors.password && touched.password ? 'error.main' : '#888' 
          },
          '&.Mui-focused fieldset': { 
            borderColor: errors.password && touched.password ? 'error.main' : '#00e676' 
          },
        },
      }}
    />
  );
};