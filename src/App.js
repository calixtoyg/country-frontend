import {BrowserRouter, Route, Switch} from 'react-router-dom'
import './App.css';
import {Box, Container} from "@material-ui/core";
import Auth from "./components/Authentication";
import PrivateRoute from "./components/PrivateRoute";
import Country from "./components/Country";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import AlertMessage from "./components/AlertMessage";
import {AlertContext} from "./components/AlertContext";
import NavBar from "./components/NavBar";


function App() {
    return (
        <div>
            <Auth>
                <AlertContext>
                    <BrowserRouter>

                        <AlertMessage/>
                        <NavBar/>

                        <Container maxWidth="lg">
                            <AlertMessage/>
                            <Box m={15}/>
                            <Switch>
                                <Route path={['/signin', '/login']}>
                                    <SignIn/>
                                </Route>
                                <Route path='/signup'>
                                    <SignUp/>
                                </Route>
                                <PrivateRoute path={['/country', "/"]} component={Country}/>

                            </Switch>
                        </Container>
                    </BrowserRouter>

                </AlertContext>
            </Auth>
        </div>
    );
}

export default App;
