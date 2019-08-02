import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import NavBar from '../NavBar';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import HomePage from '../Home';
import PasswordForgetPage from '../PasswordForget';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import PeoplePage from '../People';
import MyWishlistPage from '../MyWishlist';
import AddItemsPage from '../AddItems';

import * as ROUTES from '../../constants/routes';

import {withAuthentication} from '../Session';

const App = () => {
    return(
        <Router>
            <NavBar/>
            <Route exact path= {ROUTES.SIGN_UP} component = {SignUpPage} />
            <Route exact path= {ROUTES.SIGN_IN} component = {SignInPage} />
            <Route exact path= {ROUTES.HOME} component = {HomePage} />
            <Route exact path= {ROUTES.ACCOUNT} component = {AccountPage} />
            <Route exact path= {ROUTES.PASSWORD_FORGET} component = {PasswordForgetPage} />
            <Route exact path={ROUTES.ADMIN} component={AdminPage} />
            <Route exact path={ROUTES.PEOPLE} component={PeoplePage} />
            <Route exact path={ROUTES.MY_WISHLIST} component={MyWishlistPage} />
            <Route exact path={ROUTES.ADD_ITEMS} component={AddItemsPage} />
        </Router>
    )
};
export default withAuthentication(App);

