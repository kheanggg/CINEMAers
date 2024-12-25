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
    <Box sx={{
      position: 'fixed',        // Fixed positioning to keep it visible on the screen
      top: 20,                  // Distance from the top of the screen
      right: 20,                // Distance from the right edge
      width: 'auto',            // Automatically adjust width based on content
      zIndex: 9999,             // Ensure it stays on top of other elements
    }}>
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