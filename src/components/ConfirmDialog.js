import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from "prop-types";


export default function ConfirmDialog({handleClose, open, action}) {
    const [openConfirmDialog, setOpenConfirmDialog] = useState(!!open);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


    useEffect(() => {
        console.log(open)
        setOpenConfirmDialog(!!open)
    }, [open]);

    const handleClosingLocally = (close) => {
        setOpenConfirmDialog(false)
        handleClose(close)
    };

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={openConfirmDialog}
                onClose={() => handleClosingLocally(false)}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Confirmation Dialog</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                      Do you want to {action} this record?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => handleClosingLocally(false)} color="primary">
                        No
                    </Button>
                    <Button onClick={() => handleClosingLocally(true)} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
ConfirmDialog.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    action: PropTypes.string
}
