import React from 'react';
import { withFirebase } from '../Firebase';
import {Menu, Dropdown} from 'semantic-ui-react';

const SignOut = ({ firebase }) => (
    <span onClick={firebase.doSignOut}>
    Sign Out
    </span> );

export default withFirebase(SignOut);