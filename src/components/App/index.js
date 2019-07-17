import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import NavBar from '../NavBar';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import HomePage from '../Home';
import PasswordForgetPage from '../PasswordForget';

import * as ROUTES from '../../constants/routes';

import {withFirebase} from '../Firebase';
import {withAuthentication} from '../Session';

const App = () => {
    return(
        <Router>
            <NavBar/>
            <Route path= {ROUTES.SIGN_UP} component = {SignUpPage} />
            <Route path= {ROUTES.SIGN_IN} component = {SignInPage} />
            <Route path= {ROUTES.HOME} component = {HomePage} />
            <Route path= {ROUTES.PASSWORD_FORGET} component = {PasswordForgetPage} />
        </Router>
    )
};
export default withAuthentication(App);

