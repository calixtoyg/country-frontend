import React, {useContext, useEffect, useState} from 'react';
import {Button, Grid, makeStyles, Paper, TextField} from "@material-ui/core";
import {AlertMessageContext} from "./AlertContext";
import {authLogin} from "../services/auth";
import {useHistory} from "react-router-dom";
import {AuthContext} from "./Authentication";

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

const SignIn = (props) => {
    let history = useHistory();
    const classes = useStyles();
    const {setType, setAlertOpen, setMessage} = useContext(AlertMessageContext)
    const {login} = useContext(AuthContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // useEffect(() => {
    //     console.log("memory leak")
    //     history.push('/country');
    // }, [isAuthenticated]);


    async function handleSubmit(e) {
        e.preventDefault();
        if (email && password) {
            await login({
                email,
                password
            })
                .then(v => {
                    setType("success")
                    setAlertOpen(true)
                    setMessage("Logged in successfully")
                    history.push('/country');
                })
                .catch(e => {
                    setType("error")
                    setAlertOpen(true)
                    setMessage(`There was an error while logging in: ${e.message}`)
                })
        }
    };

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
                    <h2>Sign in</h2>
                </Grid>
                <Grid item={12}>
                    <Paper elevation={2}>
                        <form className={classes.root} onSubmit={handleSubmit}>
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
                                <Button type="submit" variant="contained" color="primary">
                                    Login
                                </Button>
                            </div>
                        </form>
                    </Paper>

                </Grid>
            </Grid>
        </div>
    );
};

export default SignIn;
