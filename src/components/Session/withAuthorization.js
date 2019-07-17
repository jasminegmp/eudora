import React from 'react';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router';
import * as ROUTES from '../../constants/routes';

const withAuthentication = condition => Component => {
  class WithAuthentication extends React.Component {

        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (!condition(authUser)){
                        this.props.history(ROUTES.SIGN_IN)
                    }
                },
            ); 
        }
    
        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser =>
                        condition(authUser) ? <Component {...this.props} /> : null
                    }
                </AuthUserContext.Consumer>
            );
        } 
    }
    
    return compose(withRouter(withFirebase(WithAuthentication)));
};

export default withAuthentication;