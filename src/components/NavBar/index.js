import React from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const NavBar = () => {
    return(
        <div>
            <div className ="ui inverted secondary menu" style = {{background: '#4ABDAC'}}>
                <a className= "item">
                    <Link to = {ROUTES.SIGN_IN}>Sign In</Link>
                </a>
                <a className= "item">
                    <Link to = {ROUTES.LANDING}>Landing</Link>
                </a>
                <a className= "item">
                    <Link to = {ROUTES.HOME}>Home</Link>
                </a>
                <a className= "item">
                    <Link to = {ROUTES.ACCOUNT}>Account</Link>
                </a>
                <a className= "item">
                    <Link to = {ROUTES.ADMIN}>Admin</Link>
                </a>
            </div>
        </div>
    )
};
export default NavBar;

