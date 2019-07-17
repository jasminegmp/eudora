import React from 'react';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router';

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                authUser: null,
            }; 
        }

        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    if (authUser){
                        this.setState({ authUser });
                    }
                    else{
                        this.props.history.push('/login');
                    }
                },
            ); 
        }
    
        componentWillUnmount() {
            this.listener();
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        } 
    }
    
    return withFirebase(WithAuthentication);
};

export default withAuthentication;