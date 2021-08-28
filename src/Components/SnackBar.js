import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function CustomizedSnackbars({ handleSnackBarClose, buddyAddedName, buddyIgnoredName }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        handleSnackBarClose()
        buddyAddedName=null
    };

    return (
        <div>
            { buddyAddedName!=null || buddyAddedName!=undefined  ? (
                    <div className={classes.root} >
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success">
                                {buddyAddedName} has been Added!
                            </Alert>
                        </Snackbar>
                        <Alert severity="success">{buddyAddedName} has been Added!</Alert>
                    </div>) : 
                    ( <div className={classes.root} >
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error">
                                {buddyIgnoredName} has been Deleted!
                            </Alert>
                        </Snackbar>
                        <Alert severity="error">{buddyIgnoredName} has been Deleted!</Alert>
                    </div>
                )
            }
        </div>
    );
}