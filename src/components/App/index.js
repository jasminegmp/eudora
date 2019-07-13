import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import NavBar from '../NavBar';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';

import * as ROUTES from '../../constants/routes';

const App = () => {
    return(
        <Router>
            <NavBar/>
            <SignInPage/>
        </Router>
    )
};
export default App;

