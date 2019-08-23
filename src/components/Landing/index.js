import React from 'react';
import './Landing.css';
import { Link} from 'react-router-dom';
import {Grid, Icon, Header, Message,Button} from 'semantic-ui-react';
import Logo from '../images/logo.png';
import * as ROUTES from '../../constants/routes';


class LandingPage extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            error: null
        };
    }


    render(){
        return (
                <Grid columns={2} stackable celled padded style={{height: '100vh'}}>
                    <Grid.Column style = {{background:"#FC4A1A",color: "#FFFFFF"}}>

                            <h1 style = {{marginTop: "25%"}}>You're one step away from joining Eudora!</h1>
                            <h3>The personalized wishlist social media network</h3>
                            <p style = {{margin:"5%"}}> <Icon name='gift' style = {{fontSize:"2em"}}/>Upload gifts that you would like onto your wishlist</p>
                            <p style = {{margin:"5%"}}><Icon name='users' style = {{fontSize:"2em"}} />  Follow friends and family to see what holidays they celebrate and what they want</p>
                            <p style = {{margin:"5%"}}><Icon name='check circle' style = {{fontSize:"2em"}} />  Gift your friends while keeping the gift a secret to the giftee</p>
                    </Grid.Column>
                    <Grid.Column textAlign = "center">
                        <Header as = "h2" icon color = "grey"  style = {{marginTop: "25%"}}>
                            <img src= {Logo} alt = "Eudora Logo" style = {{width:'150px', marginBottom: '20px'}}/>
                        </Header>
                        <h3>I'm ready!</h3>
                        <Button style = {{width: "50%"}}><Link to = {ROUTES.SIGN_UP}>Sign up</Link></Button><br/>
                        <Button style = {{marginTop: "2%", width: "50%"}}><Link to = {ROUTES.SIGN_IN}>Log in</Link></Button>
                    </Grid.Column>
                </Grid>
        );

    }
    
};

export default LandingPage;

