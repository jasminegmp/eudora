import React from 'react';
import { Link, withRouter} from 'react-router-dom';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

// a page
// returns a signup header and form
const SignUpPage =() => {
    return(
        <div className = "ui segment" style = {{width: '50%', marginLeft: '25%', marginTop: '100px'}}>
            <h1>Sign Up</h1>
            <SignUpForm />
        </div>
    )

}

// redirect to log-in page if account exists
const SignUpLink = () => {
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
                <div class="field">
                    <label>Username</label>
                    <input 
                        name = "username"
                        value = {username}
                        onChange = {this.onChange}
                        type = "text"
                        placeholder = "Username"
                    />
                </div>
                <div class="field">
                    <label>Email</label>
                    <input 
                        name = "email"
                        value = {email}
                        onChange = {this.onChange}
                        type = "text"
                        placeholder = "Email"
                    />
                </div>
                <div class="field">
                    <label>Password</label>
                    <input 
                        name = "password"
                        value = {password}
                        onChange = {this.onChange}
                        type = "password"
                        placeholder = "Password, at least 6 characters long"
                    />
                </div>
                <div class="field">
                    <label>Password Confirmation</label>
                    <input 
                        name = "passwordConfirm"
                        value = {passwordConfirm}
                        onChange = {this.onChange}
                        type = "password"
                        placeholder = "Password Confirmation"
                    />
                </div>

                <button className = "ui button " disabled = {isInvalid} type = "submit" >Create</button>

                {error && <p>{error.message}</p>} 

            </form>
        )
    }


}

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;
export { SignUpForm, SignUpLink };
