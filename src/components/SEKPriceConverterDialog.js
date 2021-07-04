import React, {useEffect, useState} from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useTheme} from "@material-ui/core/styles";
import {TextField} from "@material-ui/core";
import {GreenButton} from "./GreenButton";
import {getCountrySEKQuery} from "../services/queries";

const COUNTRY_API_GRAPHQL_URL = process.env.COUNTRY_API_GRAPHQL_URL || 'http://localhost:8080/graphql';



const SEKPriceConverterDialog = ({handleClose, open, action, country}) => {
    const [code, setCode] = useState('');
    const [openConfirmDialog, setOpenConfirmDialog] = useState(!!open);
    const [priceToConvert, setPriceToConvert] = useState(0);
    const [convertedPrice, setConvertedPrice] = useState('0');
    const [disableConvert, setDisableConvert] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        setOpenConfirmDialog(!!open)
    }, [open]);

    useEffect(() => {
        if (country) {
            setCode(country.currencies[0].code)
        }
    }, [country]);


    const handleClosingLocally = (close) => {
        setOpenConfirmDialog(false)
        handleClose(close)
    };

    async function handleGetSEKConversion() {
        setDisableConvert(true)
        let response = await (await fetch(COUNTRY_API_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(getCountrySEKQuery(country))
        })).json();
        setDisableConvert(false)
        const conversion = response.data.country.currencies.find(v => v.code === country.currencies[0].code).SEKConversion * priceToConvert;
        setConvertedPrice(`${conversion.toFixed(2)} ${country.currencies[0].symbol}`)
    }

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={openConfirmDialog}
                onClose={() => handleClosingLocally(false)}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">SEK Conversion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <TextField
                            value={priceToConvert}
                            onChange={(e) => setPriceToConvert(Number(e.target.value))}
                            autoFocus
                            margin="normal"
                            id="priceToConvert"
                            label="SEK"
                            type="number"
                            fullWidth
                        />
                        <TextField
                            value={convertedPrice}
                            autoFocus
                            margin="normal"
                            id="convertedPrice"
                            label={code}
                            type="text"
                            disabled
                            fullWidth
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => handleClosingLocally(false)} color="primary">
                        Cancel
                    </Button>
                    <GreenButton onClick={() => handleGetSEKConversion()} color="primary" autoFocus disabled={disableConvert}>
                        Convert
                    </GreenButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SEKPriceConverterDialog;
