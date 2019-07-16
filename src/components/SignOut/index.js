import React from 'react';
import { withFirebase } from '../Firebase';
import { withRouter} from 'react-router-dom';
import {Menu, Dropdown} from 'semantic-ui-react';

import * as ROUTES from '../../constants/routes';


class SignOut extends React.Component {

    handleSignOut = (event) => {
        this.props.firebase.doSignOut();

        // route user to home
        this.props.history.push(ROUTES.SIGN_IN);

    }

    render(){
        return(
            <span onClick={this.handleSignOut}>
                Sign Out
            </span>
        )
        
    }
}

export default withRouter(withFirebase(SignOut));



