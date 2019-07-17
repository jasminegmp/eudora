import React from 'react';
import { Link, withRouter} from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import {Grid, Header, Segment, Message, Form} from 'semantic-ui-react';



// a form
class PasswordChangeForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            password: '',
            passwordConfirm: '',
            error: null
        }
    }

    onSubmit = (event) => {
        const {password} = this.state;

        event.preventDefault();

        this.props.firebase
            // update password
            .doPasswordUpdate(password)

            // if successful, reinitialize state back to blanks
            .then(authUser =>{
                this.setState({
                    password: '',
                    passwordConfirm: '',
                    error: null
                });
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
        const {password, passwordConfirm, error} = this.state;

        const isInvalid = 
            password != passwordConfirm ||
            password === '';

        return(
            <form className = "ui form" onSubmit = {this.onSubmit}>
                <Segment stacked>
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
                            placeholder = "Confirm new password"
                        />
                    </div>

                    <button className = "ui button " disabled = {isInvalid} type = "submit" >Change My Password</button>

                    {error && <p>{error.message}</p>} 
                </Segment>
            </form>
        )
    }


}

export default withFirebase(PasswordChangeForm);

