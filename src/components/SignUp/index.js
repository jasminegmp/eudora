import React from 'react';
import { Link, withRouter} from 'react-router-dom';
import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

// a page
// returns a signup header and form
const SignUpPage =() => {
    return(
        <div>
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
            .doCreateWithEmailAndPassword(email, password)

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
            <form onSubmit = {this.onSubmit}>
                <input 
                    name = "username"
                    value = {username}
                    onChange = {this.onChange}
                    type = "text"
                    placeholder = "Username"
                />
                <input 
                    name = "email"
                    value = {email}
                    onChange = {this.onChange}
                    type = "text"
                    placeholder = "Email"
                />
                <input 
                    name = "password"
                    value = {password}
                    onChange = {this.onChange}
                    type = "password"
                    placeholder = "Password"
                />
                <input 
                    name = "passwordConfirm"
                    value = {passwordConfirm}
                    onChange = {this.onChange}
                    type = "password"
                    placeholder = "Password Confirmation"
                />

                <button disabled = {isInvalid} type = "submit">Sign Up</button>

                {error && <p>{error.message}</p>} 

            </form>
        )
    }


}

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;
export { SignUpForm, SignUpLink };
