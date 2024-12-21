import React, { useState, useEffect } from 'react';
import { Alert, Box, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AlertPageProps {
  type: 'success' | 'error'; // Accept only 'success' or 'error'
  message: string;
  autoCloseDuration?: number; // Optional prop for custom auto-close duration
}

const AlertPage: React.FC<AlertPageProps> = ({ type, message, autoCloseDuration = 3000 }) => {
  const [open, setOpen] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [autoCloseDuration]);

  // Close the alert manually when clicked
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={open}>
        <Alert
          severity={type}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default AlertPage;