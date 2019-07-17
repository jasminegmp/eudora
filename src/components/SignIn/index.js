import React from 'react';
import { Link, withRouter} from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import {Grid, Header, Icon, Segment, Message, Form} from 'semantic-ui-react';
import Logo from '../images/logo.png';
import {PasswordForgetLink} from '../PasswordForget';

import * as ROUTES from '../../constants/routes';

// a page
// returns a signup header and form
const SignInPage =() => {
    return(
        <Grid textAlign = "center" verticalAlign = "middle" className = "app" style = {{marginTop: 50}}>
            <Grid.Column style = {{maxWidth: 420}}>
                <Header as = "h2" color = "grey" textAlign = "center">
                    <img src= {Logo} style = {{width:'150px', marginBottom: '20px'}}/><br/>
                    Sign In
                </Header>
                <SignInForm />
                <Message><PasswordForgetLink/></Message>
                <Message>Don't have an account?<Link to = {ROUTES.SIGN_UP}> Sign up</Link></Message>
            </Grid.Column>
        </Grid>
    )

}

// redirect to log-in page if account exists
const SignUpLink = () => {
    return(
        <p>Don't have an account?
            <Link to = {ROUTES.SIGN_UP}>Sign Up</Link>
        </p>
    )
}

// a form
class SignInFormBase extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            error: null
        }
    }

    onSubmit = (event) => {
        const {email, password} = this.state;
        event.preventDefault();

        this.props.firebase
            // call firebase's signin function
            .doSignInWithEmailAndPassword(email, password)

            // if successful, reinitialize state back to blanks
            .then(authUser =>{
                this.setState({
                    email: '',
                    password: '',
                    error: null
                });

                // route user to home
                this.props.history.push(ROUTES.HOME);
            })

            // otherwise, display error
            .catch(error => {
                this.setState({error});
            });
        
    }

    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value})

    }

    render() {
        const {email, password, error} = this.state;

        const isInvalid = 
            password === '' ||
            email === '';

        return(
            <form className = "ui form" onSubmit = {this.onSubmit}>
                <Segment stacked>
                    <div className="field">
                        <Form.Input                            
                            icon = "mail" 
                            iconPosition = "left"
                            name = "email"
                            value = {email}
                            onChange = {this.onChange}
                            type = "text"
                            placeholder = "Email"
                        />
                    </div>
                    <div className="field">
                        <Form.Input
                            icon = "lock" 
                            iconPosition = "left"
                            name = "password"
                            value = {password}
                            onChange = {this.onChange}
                            type = "password"
                            placeholder = "Password, at least 6 characters long"
                        />
                    </div>

                    <button className = "ui button " disabled = {isInvalid} type = "submit" >Sign in</button>

                    {error && <p>{error.message}</p>} 
                </Segment>
            </form>
        )
    }


}

const SignInForm = compose(withRouter(withFirebase(SignInFormBase)));

export default SignInPage;
export { SignInForm, SignUpLink };
