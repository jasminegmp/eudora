import React from 'react';
import {Link} from 'react-router-dom';
import {Menu} from 'semantic-ui-react';
import * as ROUTES from '../../constants/routes';

const NavBar = () => {
    return(
        <div>
            <Menu inverted style = {{background: '#4ABDAC'}}>
                <Menu.Item as={Link} to={ROUTES.SIGN_IN}>Sign In</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.LANDING}>Landing</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.HOME}>Home</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.ACCOUNT}>Account</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.ADMIN}>Admin</Menu.Item>
            </Menu>
        </div>
    )
};
export default NavBar;