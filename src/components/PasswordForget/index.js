import React from 'react';
import { Link, withRouter} from 'react-router-dom';

import { withFirebase } from '../Firebase';
import {Grid, Header, Icon, Segment, Message, Form} from 'semantic-ui-react';
import Logo from '../images/logo.png';

import * as ROUTES from '../../constants/routes';

// a page
// returns a signup header and form
const PasswordForgetPage =() => {
    return(

        <Grid textAlign = "center" verticalAlign = "middle" className = "app" style = {{marginTop: 50}}>
            <Grid.Column style = {{maxWidth: 420}}>
                <Header as = "h2" color = "grey" textAlign = "center">
                    <img src= {Logo} style = {{width:'150px', marginBottom: '20px'}}/><br/>
                    Forgot your password?
                </Header>
                <PasswordForgetForm/>
            </Grid.Column>
        </Grid>
    )

}

// redirect to log-in page if account exists
const PasswordForgetLink = () => {
    return(
        <p>
            <Link to = {ROUTES.PASSWORD_FORGET}>Forgot your password?</Link>
        </p>
    )
}

// a form
class PasswordForgetFormBase extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            message: '',
            error: null
        }
    }

    onSubmit = (event) => {
        const {email} = this.state;
        event.preventDefault();

        this.props.firebase
            // call firebase's signin function
            .doPasswordReset(email)

            // if successful, reinitialize state back to blanks
            .then(authUser =>{
                this.setState({
                    email: '',
                    message: 'Please check your email as password reset instructions have been mailed.',
                    error: null
                });
                
                // route user to home
                //this.props.history.push(ROUTES.SIGN_IN);
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

        const isInvalid = email === '';

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

                    <button className = "ui button " disabled = {isInvalid} type = "submit" >Submit</button>

                    {this.state.message && <Message>{this.state.message}</Message>} 
                    
                    {error && <p>{error.message}</p>} 
                </Segment>
            </form>
        )
    }


}

const PasswordForgetForm = withRouter(withFirebase(PasswordForgetFormBase));

export default PasswordForgetPage;
export { PasswordForgetForm, PasswordForgetLink };
