import React, {useContext, useState} from 'react';
import {Button, FormControl, Grid, Input, InputLabel, makeStyles, Paper, TextField} from "@material-ui/core";
import { useHistory } from 'react-router-dom'

import {authSignUp} from "../services/auth";
import {AlertMessageContext} from "./AlertContext";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2),

        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '300px',
        },
        '& .MuiButtonBase-root': {
            margin: theme.spacing(2),
        },
    },
}));

function passwordChange() {

}

const SignUp = (props) => {
    let history = useHistory();
    const classes = useStyles();
    const {setType, setAlertOpen, setMessage} = useContext(AlertMessageContext)
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (firstName && email && password) {
            authSignUp({
                user: `${firstName} ${lastName}`,
                email,
                password
            })
                .then(v => {
                    setType("success")
                    setAlertOpen(true)
                    setMessage("User was created successfully")
                    history.push('/login');
                })
                .catch(e => {
                    setType("error")
                    setAlertOpen(true)
                    setMessage(`There was an error while creating the user: ${e.message}`)
                })
        }
    }

    function handleClose() {

    }

    return (
        <div>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid item={12}>
                    <h2>Sign up</h2>

                </Grid>
                <Grid item={12}>
                    <Paper elevation={2}>
                        <form className={classes.root} onSubmit={handleSubmit}>
                            <TextField
                                label="First Name"
                                variant="filled"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                            />
                            <TextField
                                label="Last Name"
                                variant="filled"
                                required
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                            />
                            <TextField
                                label="Email"
                                variant="filled"
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <TextField
                                label="Password"
                                variant="filled"
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <div>
                                <Button variant="contained" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary">
                                    Signup
                                </Button>
                            </div>
                        </form>
                    </Paper>

                </Grid>
            </Grid>
        </div>
    );
}

export default SignUp;
