import React from 'react';
import { Link, withRouter} from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import {Grid, Header, Segment, Message, Form} from 'semantic-ui-react';
import Logo from '../images/logo.png';
import md5 from 'md5';

import * as ROUTES from '../../constants/routes';

// a page
// returns a signup header and form
const SignUpPage =() => {
    return(
        <Grid textAlign = "center" verticalAlign = "middle" className = "app" style = {{marginTop: 50}}>
            <Grid.Column style = {{maxWidth: 420}}>
                <Header as = "h2" icon color = "grey" textAlign = "center">
                    <img src= {Logo} alt = "Eudora Logo" style = {{width:'150px', marginBottom: '20px'}}/><br/>
                    Sign Up
                </Header>
                <SignUpForm />
                <Message>Already have an account?<Link to = {ROUTES.SIGN_IN}> Sign in</Link></Message>
            </Grid.Column>
        </Grid>
    )

}

// redirect to log-in page if account exists
const SignInLink = () => {
    return(
        <p>Already have an account?
            <Link to = {ROUTES.SIGN_IN}>Sign In</Link>
        </p>
    )
}

// a form
class SignUpFormBase extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
            error: null
        }
    }

    onSubmit = (event) => {
        const {email, password} = this.state;
        event.preventDefault();

        this.props.firebase
            // call firebase's signup function
            .doCreateUserWithEmailAndPassword(email, password)

            // if successful, reinitialize state back to blanks
            .then(authUser =>{

                //console.log(authUser);
                
                const hash = md5(authUser.user.email);
                authUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${hash}?d=identicon`
                })

                this.setState({
                    username: '',
                    email: '',
                    password: '',
                    passwordConfirm: '',
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
        const {username, email, password, passwordConfirm, error} = this.state;

        const isInvalid = 
            password !== passwordConfirm ||
            password === '' ||
            email === '' ||
            username === '';

        return(
            <form className = "ui form" onSubmit = {this.onSubmit}>
                <Segment stacked>
                    <div className="field">
                        <Form.Input
                            icon = "user" 
                            iconPosition = "left"
                            name = "username"
                            value = {username}
                            onChange = {this.onChange}
                            type = "text"
                            placeholder = "Username"
                        />
                    </div>
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
                    <div className="field">
                        <Form.Input
                            icon = "lock" 
                            iconPosition = "left"
                            name = "passwordConfirm"
                            value = {passwordConfirm}
                            onChange = {this.onChange}
                            type = "password"
                            placeholder = "Password Confirmation"
                        />
                    </div>

                    <button className = "ui button " disabled = {isInvalid} type = "submit" >Create</button>

                    {error && <p>{error.message}</p>} 
                </Segment>
            </form>
        )
    }


}

const SignUpForm = compose(withRouter(withFirebase(SignUpFormBase)));

export default SignUpPage;
export { SignUpForm, SignInLink };
