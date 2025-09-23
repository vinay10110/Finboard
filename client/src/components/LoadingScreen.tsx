import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, LinearProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface LoadingScreenProps {
  onBackendReady: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onBackendReady }) => {
  const theme = useTheme();
  const [status, setStatus] = useState<'checking' | 'connecting' | 'ready' | 'error'>('checking');
  const [progress, setProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const baseUrl = import.meta.env.VITE_HOST_ADDRESS;
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.status === 'healthy';
      }
      return false;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  };

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let healthCheckInterval: NodeJS.Timeout;

    const startHealthCheck = async () => {
      setStatus('connecting');
      setProgress(0);

      // Simulate progress bar
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90; // Cap at 90% until backend is ready
          return prev + Math.random() * 15;
        });
      }, 200);

      // Check backend health
      const maxRetries = 30; // 30 attempts over ~1 minute
      let attempts = 0;

      healthCheckInterval = setInterval(async () => {
        attempts++;
        setRetryCount(attempts);

        const isHealthy = await checkBackendHealth();

        if (isHealthy) {
          setStatus('ready');
          setProgress(100);
          clearInterval(progressInterval);
          clearInterval(healthCheckInterval);
          
          // Small delay for smooth UX
          setTimeout(() => {
            onBackendReady();
          }, 500);
        } else if (attempts >= maxRetries) {
          setStatus('error');
          setErrorMessage('Backend is taking longer than expected to start. Please check your server.');
          clearInterval(progressInterval);
          clearInterval(healthCheckInterval);
        }
      }, 2000); // Check every 2 seconds
    };

    startHealthCheck();

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (healthCheckInterval) clearInterval(healthCheckInterval);
    };
  }, [onBackendReady]);

  const getStatusMessage = () => {
    switch (status) {
      case 'checking':
        return 'Initializing application...';
      case 'connecting':
        return `Connecting to backend... (Attempt ${retryCount}/30)`;
      case 'ready':
        return 'Backend is ready! Loading dashboard...';
      case 'error':
        return 'Connection failed';
      default:
        return 'Loading...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor={theme.palette.background.default}
      padding="2rem"
    >
      {/* Logo/Title */}
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        Finboard
      </Typography>

      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        sx={{
          color: theme.palette.text.secondary,
          marginBottom: '3rem',
          textAlign: 'center',
        }}
      >
        Finance Dashboard
      </Typography>

      {/* Loading Animation */}
      <Box display="flex" flexDirection="column" alignItems="center" width="100%" maxWidth="400px">
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: getStatusColor(),
            marginBottom: '2rem',
          }}
        />

        {/* Progress Bar */}
        <Box width="100%" marginBottom="1rem">
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.palette.grey[300],
              '& .MuiLinearProgress-bar': {
                backgroundColor: getStatusColor(),
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Status Message */}
        <Typography
          variant="body1"
          sx={{
            color: getStatusColor(),
            textAlign: 'center',
            marginBottom: '1rem',
            fontWeight: 500,
          }}
        >
          {getStatusMessage()}
        </Typography>

        {/* Progress Percentage */}
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            marginBottom: '2rem',
          }}
        >
          {Math.round(progress)}%
        </Typography>

        {/* Error Alert */}
        {status === 'error' && (
          <Alert 
            severity="error" 
            sx={{ 
              width: '100%', 
              marginTop: '1rem',
              textAlign: 'center' 
            }}
          >
            <Typography variant="body2">
              {errorMessage}
            </Typography>
            <Typography variant="body2" sx={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              Please ensure your backend server is running on{' '}
              <strong>{import.meta.env.VITE_HOST_ADDRESS}</strong>
            </Typography>
          </Alert>
        )}

        {/* Loading Tips */}
        {status === 'connecting' && retryCount > 5 && (
          <Box
            sx={{
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '8px',
              border: `1px solid ${theme.palette.divider}`,
              width: '100%',
            }}
          >
            <Typography variant="body2" color="text.secondary" textAlign="center">
              💡 <strong>First time startup?</strong> The backend may take up to a minute to initialize the database connection.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LoadingScreen;
