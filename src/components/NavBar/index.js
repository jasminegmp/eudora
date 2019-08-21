import React from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import SignOut from '../SignOut';
import { withRouter} from 'react-router-dom';
import {AuthUserContext} from '../Session';
import Logo from '../images/icon.png';
import { Responsive, Icon, Image, Menu, Dropdown, Sidebar } from 'semantic-ui-react';
import { withFirebase } from '../Firebase';

const options = [
    {   key: 'user', 
        text: <span>Account Info</span>, 
        icon: 'user', 
        as: Link, 
        to: ROUTES.ACCOUNT 
    },
    {
        key: 'sign out',
        text: <SignOut/>,
        icon: 'sign-out'
    }
  ];



class NavBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visible: false
        }
    }

    onClick = () => {
        this.setState({ visible: !this.state.visible });
    }

    onClose = () => {
        this.setState({ visible: false });
    }

    onSignOut = () => {
            this.props.firebase.doSignOut();
            // route user to home
            this.props.history.push(ROUTES.SIGN_IN);
    
    }


    render(){
        return(
            <AuthUserContext.Consumer>
                {authUser => authUser ? 
                <NavBarAuth
                    onClick={this.onClick}
                    onClose={this.onClose}
                    onSignOut = {this.onSignOut}
                    visible={this.state.visible}
                /> : <NavBarNonAuth/>}
            </AuthUserContext.Consumer>
        );
    }
}


const NavBarAuth = ({
    onClick,
    onClose,
    onSignOut,
    visible
}) => {
    return(
        <div>
            <Responsive maxWidth={640}>
                <NavBarMobileAuth
                            onClick={onClick}
                            onClose={onClose}
                            onSignOut = {onSignOut}
                            visible={visible}
                />
            </Responsive>
            <Responsive minWidth={640}>
                <NavBarDesktopAuth
                            onClick={onClick}
                            onClose={onClose}
                            visible={visible}
                />
            </Responsive>
        </div>
    )
}


const NavBarMobileAuth = ({
        onClick,
        onClose,
        onSignOut,
        visible
    }) => {
    return(
        <div> 
            <Menu fixed="top" inverted>
            <Menu.Item as={Link} to={ROUTES.ABOUT}><Image size="mini" src= {Logo} alt = "Eudora Logo"/></Menu.Item>
                <Menu.Item onClick={onClick}>
                    <Icon name="sidebar" />
                </Menu.Item>
            </Menu>
            <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            inverted
            vertical
            visible={visible}
            width='thin'
            >
                <Menu.Item as={Link} to={ROUTES.HOME}><Icon name='home' />Home</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.PEOPLE}><Icon name='users' />People</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.SHOP_ETSY}><Icon name='plus' />Shop Etsy</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.MY_WISHLIST}><Icon name='gift' />My Wishlist</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.ACCOUNT }><Icon name='user' />Account Info</Menu.Item>
                <Menu.Item as={Link} onClick = {onSignOut} ><Icon name='sign-out' />Sign Out</Menu.Item>
                <Menu.Item as={Link} onClick = {onClose}><Icon name='close' />Close</Menu.Item>
            </Sidebar>
        </div>
    )
};

class NavBarDesktopAuth extends React.Component {

    state = {}

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });


    render(){
        const { activeItem } = this.state;
        return(
            <div>
                <Menu fixed="top" inverted style = {{width: '100%'}}>
                    <Menu.Item as={Link} to={ROUTES.ABOUT}><Image size="mini" src= {Logo} alt = "Eudora Logo"/></Menu.Item>
                    <Menu.Item name ="home" onClick = {this.handleItemClick} active={activeItem === 'home'} as={Link} to={ROUTES.HOME}><Icon name='home' />Home</Menu.Item>
                    <Menu.Item name = "people" onClick = {this.handleItemClick} active={activeItem === 'people'} as={Link} to={ROUTES.PEOPLE}><Icon name='users' />People</Menu.Item>
                    <Menu.Item name = "add-items" onClick = {this.handleItemClick} active={activeItem === 'add-items'} as={Link} to={ROUTES.SHOP_ETSY}><Icon name='plus' />Shop Etsy</Menu.Item>
                    <Menu.Item name = "my-wishlist" onClick = {this.handleItemClick} active={activeItem === 'my-wishlist'} as={Link} to={ROUTES.MY_WISHLIST}><Icon name='gift' />My Wishlist</Menu.Item>
                    <Menu.Item name = "account"> 
                    <Dropdown trigger = {
                                <span>
                                    <Icon name='user' />
                                    Account
                                </span>
                    } options = {options} />
                    </Menu.Item>
                </Menu>
            </div>
        )
    }

};

const NavBarNonAuth = () => {
    return(
        <div>
            <Menu inverted style = {{ width: '100%'}}>
                <Menu.Item as={Link} to={ROUTES.ABOUT}><Image size="mini" src= {Logo} alt = "Eudora Logo"/></Menu.Item>
                <Menu.Item as={Link} to={ROUTES.LANDING}>Landing</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.SIGN_IN}>Sign In</Menu.Item>
            </Menu>
        </div>
    )
};

export default withRouter(withFirebase(NavBar));