import React, {useContext} from 'react';
import {
    AppBar, Button, Grid, Icon,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import {useHistory} from "react-router-dom";
import {AuthContext} from "./Authentication";
import {authLogout} from "../services/auth";
import {ExitToApp} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 2
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        [theme.breakpoints.down("xs")]: {
            flexGrow: 1
        }
    },
    headerOptions: {
        display: "flex",
        flex: 1,
        justifyContent: "flex-start"
    },
    rightOptions: {
        display: "flex",
        flex: 1,
        justifyContent: "flex-end"
    },
    button: {
        margin: theme.spacing(1),
    },
}));

function NavBar() {
    const { isAuthenticated, isLoading, logout } = useContext(AuthContext)

    let history = useHistory();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const menuItems = [
        {
            menuTitle: "Country list",
            pageURL: "/country"
        },
        {
            menuTitle: "Login",
            pageURL: "/login"
        },
        {
            menuTitle: "Sign up",
            pageURL: "/signup"
        }
    ];
    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = pageURL => {
        history.push(pageURL);
        setAnchorEl(null);
    };

    const handleButtonClick = pageURL => {
        history.push(pageURL);
    };

    function handleLogout() {
        logout()
        history.push('/login')
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>

                    </Typography>
                    {isMobile ? (
                        <>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                className={classes.menuButton}
                                onClick={handleMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right"
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right"
                                }}
                                open={open}
                                onClose={() => setAnchorEl(null)}
                            >
                                {menuItems.map(menuItem => {
                                    const { menuTitle, pageURL } = menuItem;
                                    return (
                                        <MenuItem onClick={() => handleMenuClick(pageURL)}>
                                            {menuTitle}
                                        </MenuItem>
                                    );
                                })}
                            </Menu>
                        </>
                    ) : (
                        <Grid container
                              direction="row"
                              justify="space-between"
                              alignItems="center"
                              spacing={1}>
                            <Grid item xs={11}>
                                <IconButton
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={() => handleButtonClick("/country")}
                                >
                                    Country list
                                </IconButton>
                            </Grid>
                            <Grid item xs={1}>
                                {
                                    isAuthenticated ?
                                        <Button className={classes.button} onClick={() => handleLogout()} startIcon={<ExitToApp/>}>Logout</Button> :
                                        <div>
                                            <Button onClick={() => handleButtonClick("/login")}>Login</Button>
                                            <Button onClick={() => handleButtonClick("/signup")}>Sing up</Button>
                                        </div>
                                }
                            </Grid>

                        </Grid>

                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default NavBar;
