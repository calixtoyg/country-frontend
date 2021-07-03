import React, {useContext, useEffect, useState} from 'react';
import {DataGrid} from '@material-ui/data-grid';
import {Button, Grid} from "@material-ui/core";
import ConfirmDialog from "./ConfirmDialog";
import {AlertMessageContext} from "./AlertContext";
import CountryDialog from "./CountryDialog";

const getCountriesQuery = {
    "query": "{\r\n    countries {id\r\n        name,\r\n        currencies {\r\n            code,\r\n            name,\r\n            symbol\r\n        },\r\n        population\r\n    }\r\n}",
    "variables": {}
};


const COUNTRY_API_GRAPHQL_URL = process.env.COUNTRY_API_GRAPHQL_URL || 'http://localhost:8080/graphql';
const Country = () => {
    const {setType, setAlertOpen, setMessage} = useContext(AlertMessageContext)
    const [countries, setCountries] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [countryId, setCountryId] = useState('');
    const [country, setCountry] = useState(undefined);
    const [countryDialog, setCountryDialog] = useState(false);
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
            width: 300,
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
            setType("success")
            setMessage(`Country was deleted successfully`)
            setAlertOpen(true)
            await getCountries()
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
            setCountryDialog(false)
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


    const deleteCountryQuery = (id) => ({
        query: `mutation {\r
            deleteCountry(id:  "${id}"){\r
              name\r
            }\r
     }\r`, "variables": {}
    })

    const editCountryQuery = (country) => ({
        "query": `mutation { 
            editCountry(\r
             id: "${country.id}",\r
             name: "${country.name}", \r
             currencies: ${JSON.stringify(country.currencies).replace(/"([^"]+)":/g, '$1:')},\r  
             population: ${Number(country.population)}\r
            ){\r
               name\r
             }\r
        }\r`,
        "variables": {}
    })

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
        setCountryDialog(true);
    }
   function handleCountryDialogClose(args) {
        setCountryDialog(false);
    }

    return (
        <div>
            <CountryDialog open={countryDialog} country={country} edit={editCountry} onClose={handleCountryDialogClose}/>
            <ConfirmDialog action={"delete"} open={open} handleClose={handleConfirmDialog}/>
            <div style={{height: 600, width: '100%'}}>
                <DataGrid
                    rows={countries}
                    columns={columns}
                    pageSize={15}
                    disableSelectionOnClick
                />
            </div>
        </div>
    );
};

export default Country;
