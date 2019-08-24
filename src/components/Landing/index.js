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
                <Grid columns={2} stackable style={{height: '100vh',}}>
                    <Grid.Column className = "landing-col" style = {{background:"#FC4A1A",color: "#FFFFFF"}}>
                        
                            <h1 className = "media-margin h1-class">You're one step away from joining Eudora!</h1>
                            <h3 className = "media-margin">The personalized wishlist social media network</h3>
                            <p className = "media-margin"> <Icon name='gift' style = {{fontSize:"2em"}}/>Upload gifts that you would like onto your wishlist</p>
                            <p className = "media-margin"><Icon name='users' style = {{fontSize:"2em"}} />  Follow friends and family to see what holidays they celebrate and what they want</p>
                            <p className = "media-margin"><Icon name='check circle' style = {{fontSize:"2em"}} />  Gift your friends while keeping the gift a secret to the giftee</p>
                    </Grid.Column>
                    <Grid.Column textAlign = "center">
                        <Header as = "h2" icon color = "grey">
                            <img className = "logo-class" src= {Logo} alt = "Eudora Logo" style = {{width:'150px', marginBottom: '20px'}}/>
                        </Header><br/>
                        
                        <h3>I'm ready!</h3>
                        <Link to = {ROUTES.SIGN_UP}><Button className = "button-orange">Sign up</Button></Link><br/>
                        <Link to = {ROUTES.SIGN_IN}><Button className = "button-orange">Log in</Button></Link><br/>

                        <Link to = {ROUTES.ABOUT}><Button className = "button-orange" >Learn More</Button></Link>
                    </Grid.Column>
                </Grid>
        );

    }
    
};

export default LandingPage;

