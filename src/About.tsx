import React, { useState } from 'react';
import './App.css'; // Make sure to create and import a CSS file for styling
import { Box, Modal, Typography, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  // bgcolor: 'background.paper',
  p: 4,
  background: 'rgba(255, 255, 255, 0.35)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
};

const flexRow = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const About: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // sx={{
        //   '&:focus': {
        //     outline: 'none',
        //   },
        // }}
      >
        <Box sx={style}>
          <Box sx={flexRow}>
            <Typography sx={{ color: 'white' }} variant="h4" component="h2">Welcome!</Typography>
            <div className="close-button" onClick={handleClose}>&times;</div>
          </Box>

          <Typography sx={{ mt: 2, color: 'white' }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default About;