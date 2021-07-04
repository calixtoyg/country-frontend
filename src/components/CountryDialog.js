import React, {useEffect, useState} from 'react';
import Button from "@material-ui/core/Button";
import {Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";

const countriesRateKeys = ["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTC", "BTN", "BWP", "BYN", "BYR", "BZD", "CAD", "CDF", "CHF", "CLF", "CLP", "CNY", "COP", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LVL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "STD", "SVC", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMK", "ZMW", "ZWL"]

const CountryDialog = ({open, isSave, handleClosing,country, onClose}) => {

    const [countryDialogOpen, setCountryDialogOpen] = useState(open);
    const [countryRateKey, setCountryRateKey] = useState(countriesRateKeys[0]);
    const [countryPopulation, setCountryPopulation] = useState(0);
    const [countryName, setCountryName] = useState('');
    const [currencySymbol, setCurrencySymbol] = useState('');
    const [currencyName, setCurrencyName] = useState('');

    useEffect(() => {
        setCountryDialogOpen(open)
    }, [open]);


    useEffect(() => {
        if (country) {
            let currency = country.currencies[0];
            setCountryRateKey(currency.code)
            setCountryName(country.name)
            setCountryPopulation(country.population)
            setCurrencyName(currency.name)
            setCurrencySymbol(currency.symbol)
        }
    }, [country]);

    function getCountry() {
        return {
            ...country,
            name: countryName,
            population: countryPopulation,
            currencies: [
                {
                    code: countryRateKey,
                    name: currencyName,
                    symbol: currencySymbol
                }
            ]
        };
    }

    const handleSave = () => {
        setCountryDialogOpen(false)
        handleClosing(getCountry());
    };

    const handleClose = () => {
        setCountryDialogOpen(false);
        onClose()
    }
    const handleCountryRateKeyChange = (e) => {
        setCountryRateKey(e.target.value)
    }

    return (
        <div>
            <Dialog open={countryDialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{isSave ? 'Save Country' : 'Edit Country'}</DialogTitle>
                <DialogContent>
                    <TextField
                        value={countryName}
                        onChange={(e) => setCountryName(e.target.value)}
                        autoFocus
                        margin="normal"
                        id="name"
                        label="Country's name"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        value={countryPopulation}
                        onChange={(e) => setCountryPopulation(Number(e.target.value))}
                        margin="normal"
                        id="population"
                        label="Country's population"
                        type="number"
                        fullWidth
                    />
                    <InputLabel id="country-rate-key-label">Country rate key</InputLabel>
                    <Select
                        margin="none"
                        labelId="country-rate-key-label"
                        id="country-rate-key"
                        value={countryRateKey}
                        onChange={handleCountryRateKeyChange}
                        fullWidth
                    >
                        {countriesRateKeys.map(key => (
                            <MenuItem value={key}>{key}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>EG:'EUR' for Euro</FormHelperText>
                    <TextField
                        value={currencyName}
                        onChange={(e) => setCurrencyName(e.target.value)}
                        margin="normal"
                        id="currencyName"
                        label="Currency's name"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        value={currencySymbol}
                        onChange={(e) => setCurrencySymbol(e.target.value)}
                        margin="normal"
                        id="currencySymbol"
                        label="Currency's symbol"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    {isSave ?
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button> :
                        <Button onClick={handleSave} color="secondary">
                            Edit
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CountryDialog;
