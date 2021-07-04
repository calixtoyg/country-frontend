import React, {useContext, useEffect, useState} from 'react';
import {DataGrid} from '@material-ui/data-grid';
import {Button, Grid, Input, InputAdornment, InputLabel} from "@material-ui/core";
import ConfirmDialog from "./ConfirmDialog";
import {AlertMessageContext} from "./AlertContext";
import CountryDialog from "./CountryDialog";
import {GreenButton} from "./GreenButton";
import SEKPriceConverterDialog from "./SEKPriceConverterDialog";
import {deleteCountryQuery, editCountryQuery, getCountriesQuery, getCountriesQueryByName, saveCountryQuery} from "../services/queries";
import {Search} from "@material-ui/icons";


const COUNTRY_API_GRAPHQL_URL = process.env.COUNTRY_API_GRAPHQL_URL || 'http://localhost:8080/graphql';
const Country = () => {
    const {setType, setAlertOpen, setMessage} = useContext(AlertMessageContext)
    const [countries, setCountries] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [countryId, setCountryId] = useState('');
    const [country, setCountry] = useState(undefined);
    const [saveCountryDialog, setSaveCountryDialog] = useState(false);
    const [editCountryDialog, setEditCountryDialog] = useState(false);
    const [converterDialog, setConverterDialog] = useState(false);
    const columns = [
        {
            field: "name",
            headerName: "Country",
            width: 150,
        },
        {
            field: "population",
            headerName: "Population",
            width: 150,
        },
        {
            field: "currencies",
            headerName: "Currency",
            width: 150,
            valueGetter: getCurrency,
        },
        {
            field: '',
            headerName: 'Actions',
            width: 320,
            renderCell: getButtons
        }
    ]

    useEffect(async () => {
        await getCountries()
    }, []);


    useEffect(async () => {
        if (confirmDialog) {
            await deleteCountryById()
        }
    }, [confirmDialog]);

    function getButtons(arg) {
        return (
            <Grid container spacing={1}>
                <Grid item={3}>
                    <Button color="secondary" variant="contained" onClick={() => deleteCountryHandler(arg.id)}>Delete</Button>
                </Grid>
                <Grid item={3}>
                    <Button color="primary" variant="contained" onClick={() => editCountryHandler(arg)}>Edit</Button>
                </Grid>
                <Grid item={3}>
                    <GreenButton onClick={() => convertToSekHandler(arg)}>Convert to SEK</GreenButton>
                </Grid>
            </Grid>
        )
    }

    async function deleteCountryById() {
        let response;
        try {
            response = await (await fetch(COUNTRY_API_GRAPHQL_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(deleteCountryQuery(countryId))
            })).json();
            if (response.errors) {
                setType("error")
                setMessage(`Countries could not be deleted: ` + response.errors[0].message)
                setAlertOpen(true)
            }
            await getCountries()
            setType("success")
            setMessage(`Country was deleted successfully`)
            setAlertOpen(true)
        } catch (e) {
            setType("error")
            setMessage(`Country was not deleted an error occurred: ` + e.message)
            setAlertOpen(true)
        }
    }

    async function editCountry(country) {
        try {
            let response = await (await fetch(COUNTRY_API_GRAPHQL_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(editCountryQuery(country))
            })).json();
            setEditCountryDialog(false)
            if (response.errors) {
                throw new Error('There was an error during edition')
            }
            setType("success")
            setMessage(`Country was edited successfully`)
            setAlertOpen(true)
            await getCountries()
        } catch (e) {
            setType("error")
            setMessage(`Country was not deleted an error occurred: ` + e.message)
            setAlertOpen(true)
        }
    }


    async function saveCountry(country) {
        try {
            let response = await (await fetch(COUNTRY_API_GRAPHQL_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(saveCountryQuery(country))
            })).json();
            setSaveCountryDialog(false)
            if (response.errors) {
                throw new Error('There was an error during edition')
            }
            setType("success")
            setMessage(`Country was edited successfully`)
            setAlertOpen(true)
            await getCountries()
        } catch (e) {
            setType("error")
            setMessage(`Country was not deleted an error occurred: ` + e.message)
            setAlertOpen(true)
        }
    }

    const getCountries = async () => {
        let response = await (await fetch(COUNTRY_API_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(getCountriesQuery)
        })).json();
        setCountries(response.data.countries);
    }




    function handleConfirmDialog(shouldClose) {
        setConfirmDialog(shouldClose)
        setOpen(false)
    }

    function getCurrency(params) {
        return params.value[0].name
    }

    function deleteCountryHandler(id) {
        setOpen(true)
        setCountryId(id);
    }

    function editCountryHandler(args) {
        setCountry({...args.row});
        setEditCountryDialog(true);
    }
   function handleCountryDialogClose(args) {
        setEditCountryDialog(false);
        setSaveCountryDialog(false)
    }

    function handleSEKConverterDialogClose(args) {
        setConverterDialog(false)
    }

    function convertToSekHandler(args) {
        setCountry({...args.row})
        setConverterDialog(true)
    }

    async function handleSearch(value) {
        let response = await (await fetch(COUNTRY_API_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(getCountriesQueryByName(value))
        })).json();
        if (response.errors) {
            setType("error")
            setMessage(`Countries could not be fetched reason: ` + response.errors[0].message)
            setAlertOpen(true)
            setCountries([])
        } else {
            setCountries(response.data.countries);
        }
    }

    return (
        <div>
            <CountryDialog open={editCountryDialog} country={country} handleClosing={editCountry} onClose={handleCountryDialogClose}/>
            <CountryDialog open={saveCountryDialog} handleClosing={saveCountry} isSave={true} onClose={handleCountryDialogClose}/>
            <ConfirmDialog action={"delete"} open={open} handleClose={handleConfirmDialog}/>
            <SEKPriceConverterDialog open={converterDialog} country={country} handleClose={handleSEKConverterDialogClose}/>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <InputLabel htmlFor="search">Search by name</InputLabel>
                    <Input
                        id="search"
                        fullWidth
                        onChange={(e) => handleSearch(e.target.value)}
                        startAdornment={
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        }
                    />
                </Grid>
                <Grid item xs={3}>
                    <GreenButton onClick={() => setSaveCountryDialog(true)}>Add country</GreenButton>
                </Grid>
                <Grid item xs={12} >
                    <div style={{height: 600, width: '100%'}}>
                        <DataGrid
                            rows={countries}
                            columns={columns}
                            pageSize={15}
                            disableSelectionOnClick
                        />
                    </div>
                </Grid>

            </Grid>

        </div>
    );
};

export default Country;
