import React from 'react';
import { withAuthorization } from '../Session';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { withRouter} from 'react-router-dom';
import {Menu, Icon} from 'semantic-ui-react';

const HomePage = () => {
    return (
        <div style = {{margin: 70}}>
            <h1>Welcome to Eudora!</h1>
           
        </div>
    );
};

const condition = authUser => !!authUser;

export default withRouter(withAuthorization(condition)(HomePage));
