import React from 'react';
import {Link} from 'react-router-dom';
import {Menu, Dropdown} from 'semantic-ui-react';
import * as ROUTES from '../../constants/routes';
import SignOut from '../SignOut';
import {AuthUserContext} from '../Session';

const options = [
    {   key: 'user', 
        text: <span>Account</span>, 
        icon: 'user', 
        as: Link, 
        to: ROUTES.ACCOUNT 
    },
    {
        key: 'sign out',
        text: <SignOut/>,
        icon: 'sign-out'
    }
  ];

const NavBar = () => {
    return(
        <AuthUserContext.Consumer>
            {authUser => authUser ? <NavBarAuth/> : <NavBarNonAuth/>}
        </AuthUserContext.Consumer>
    );
}

const NavBarAuth = () => {
    return(
        <div>
            <Menu inverted style = {{background: '#4ABDAC', width: '100%'}}>
                <Menu.Item as={Link} to={ROUTES.LANDING}>Landing</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.HOME}>Home</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.PEOPLE}>People</Menu.Item>
                <Menu.Item>
                <Dropdown trigger = {
                            <span>
                                Account
                            </span>
                } options = {options} />
                </Menu.Item>
            </Menu>
        </div>
    )
};

const NavBarNonAuth = () => {
    return(
        <div>
            <Menu inverted style = {{background: '#4ABDAC', width: '100%'}}>
                <Menu.Item as={Link} to={ROUTES.LANDING}>Landing</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.SIGN_IN}>Sign In</Menu.Item>
            </Menu>
        </div>
    )
};

export default NavBar;