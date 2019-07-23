import React from 'react';
import { Link, withRouter} from 'react-router-dom';
import FileUploader from "react-firebase-file-uploader";
import { withFirebase } from '../Firebase';
import {Grid, Header, Segment, Message, Form} from 'semantic-ui-react';
import Logo from '../images/logo.png';
import md5 from 'md5';
import 'firebase/storage';
import app from 'firebase/app';

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
        this.storage = app.storage();
        this.state = {
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            passwordConfirm: '',
            avatarUrl: '',
            error: null
        }
    }

    onSubmit = (event) => {
        const {username, firstName, lastName, email, password, avatarUrl} = this.state;
        let photoUrl = '';
        event.preventDefault();

        this.props.firebase
            // call firebase's signup function
            .doCreateUserWithEmailAndPassword(email, password)

            //
            .then(authUser =>{

                //console.log(authUser);
                if (avatarUrl){

                }
                else{
                    const hash = md5(authUser.user.email);
                    photoUrl = `http://gravatar.com/avatar/${hash}?d=identicon`;
                }
                authUser.user.updateProfile({
                    displayName: username,
                    photoURL: photoUrl
                })
                this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        email,
                        firstName,
                        lastName
                    });
                this.props.firebase
                    .profile(authUser.user.uid)
                    .set({
                        username, 
                        photoUrl,
                        firstName,
                        lastName
                    });
            })

            .then(() => {
                this.setState({
                    username: '',
                    firstName: '',
                    lastName: '',
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
        const {username, firstName, lastName, email, password, passwordConfirm, error} = this.state;

        const isInvalid = 
            password !== passwordConfirm ||
            password === '' ||
            email === '' ||
            username === '' || 
            firstName === '' ||
            lastName === '';

        return(
            <form className = "ui form" onSubmit = {this.onSubmit}>
                <Segment stacked>
                    <div className="field">
                        <Form.Input
                            name = "firstName"
                            value = {firstName}
                            onChange = {this.onChange}
                            type = "text"
                            placeholder = "First Name"
                        />
                    </div>
                    <div className="field">
                        <Form.Input
                            name = "lastName"
                            value = {lastName}
                            onChange = {this.onChange}
                            type = "text"
                            placeholder = "Last Name"
                        />
                    </div>
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


const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;
export { SignUpForm, SignInLink };
