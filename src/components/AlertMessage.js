import * as React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from "prop-types";
import {useContext} from "react";
import {AlertMessageContext} from "./AlertContext";


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertMessage() {
    const {alertOpen, type, message, setAlertOpen} = useContext(AlertMessageContext)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertOpen(false);
    };

    return (
        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={type} sx={{width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>
    );
}


AlertMessage.propTypes = {
    open: PropTypes.bool,
    type: PropTypes.oneOf(["error","warning","info","success"])
}
