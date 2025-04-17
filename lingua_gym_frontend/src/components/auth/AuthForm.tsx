import { Box, Alert, Typography } from '@mui/material';
import { useAuth } from '../../hooks/auth/UseAuthForm';
import { AuthTabs } from './AuthTabs';
import { SocialAuth } from './SocialAuth';
import { EmailField } from './EmailField';
import { ForgotPasswordLink } from './ForgotPasswordLink';
import { UsernameField } from './UsernameField';
import { PasswordField } from './PasswordField';
import { ConfirmPasswordField } from './ConfirmPasswordField';
import { SubmitButton } from './SubmitButton';
import { DisplayNameField } from './DisplayNameField';
import { AnimatePresence, motion } from 'framer-motion';

export const AuthForm = () => {
  const { errors, activeTab, isTabSwitching } = useAuth();

  return (
    <motion.div
      transition={{ layout: { duration: 0.4, ease: 'easeInOut' } }}
      style={{ maxWidth: 400, margin: 'auto', marginTop: 80 }}
    >
      <Box
        sx={{
          bgcolor: '#1e1e1e',
          borderRadius: 4,
          p: 4,
          boxShadow: 3,
          overflow: 'hidden',
        }}
      >
        <AuthTabs />

        {errors.form && <Alert severity="error" sx={{ mb: 2 }}>{errors.form}</Alert>}

        <SocialAuth />

        <Typography variant="body2" sx={{ color: 'gray', textAlign: 'center', mb: 2 }}>
          or use your email
        </Typography>

        <AnimatePresence mode="wait">
          {!isTabSwitching && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <EmailField />
              {activeTab === 1 && (
                <>
                  <UsernameField />
                  <DisplayNameField />
                </>
              )}
              <PasswordField />
              {activeTab === 0 && <ForgotPasswordLink />}
              {activeTab === 1 && <ConfirmPasswordField />}
              <SubmitButton />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
};
