import React, { useEffect, useState, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

function ProfileDialog({handleDialogClose, dialogContent}) { 
    const [open, setOpen] = React.useState(true);

  
  
    const handleClose = () => {
      setOpen(false);
      handleDialogClose()
    };
   

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{dialogContent}</DialogTitle>
        <DialogContent>
            {/* <DialogContentText id="alert-dialog-description">
                Profile Successfully Updated
            </DialogContentText> */}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                OK
            </Button>
        </DialogActions>
    </Dialog>  
    );
};

export default ProfileDialog;

