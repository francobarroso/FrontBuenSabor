import React from 'react';
import { Modal, CircularProgress, Typography, Box } from '@mui/material';

interface LoadingModalProps {
  open: boolean;
  msj: string;
  accion: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ open, msj, accion }) => {
  return (
    <Modal open={open} onClose={() => {}}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'white',
            padding: 4,
            borderRadius: 1,
          }}
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            {accion} {msj}, por favor espere...
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoadingModal;