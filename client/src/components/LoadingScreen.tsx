import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface LoadingScreenProps {
  onBackendReady: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onBackendReady }) => {
  const theme = useTheme();

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
    let healthCheckInterval: number;

    const startHealthCheck = async () => {
      // Check backend health
      healthCheckInterval = setInterval(async () => {
        const isHealthy = await checkBackendHealth();

        if (isHealthy) {
          clearInterval(healthCheckInterval);
          // Small delay for smooth UX
          setTimeout(() => {
            onBackendReady();
          }, 500);
        }
      }, 2000); // Check every 2 seconds
    };

    startHealthCheck();

    return () => {
      clearInterval(healthCheckInterval);
    };
  }, [onBackendReady]);

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
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            marginBottom: '2rem',
          }}
        />

        {/* Status Message */}
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.primary.main,
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          Connecting...
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
