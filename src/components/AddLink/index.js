import React from 'react';
import {Segment, Form, Menu, Button, Grid} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import {Link} from 'react-router-dom';

class AddLinkPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            title: '',
            price : '',
            note: '',
            url: '',
            id: null,
            image: '',
            seller: null,
            isSubmitted: false,
            newSearchTerm: false,
            error: null
        }
    }

    componentDidMount(){
        var defaultImage = this.props.firebase.storage.ref(`items/gift.svg`);
        defaultImage.getDownloadURL().then((url) => { this.setState({ image: url })});

        const randomNumber = Math.floor((Math.random() * (99999999)));
        this.setState({id: randomNumber});
    }

    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
        this.setState({newSearchTerm: true});
        this.setState({isSubmitted: false});  
    }

    onSubmit =  async (event) => {

        const { price, url, note, id, title, image, seller} = this.state;
        const user = this.props.firebase.currentUser();


        event.preventDefault();
        this.props.firebase.addWishlistDb(user.uid, title, url, image, id, price, false, note, seller)
            .then(() => {
                this.setState({
                    title: '',
                    price : '',
                    note: '',
                    url: '',
                    result: null,
                    newSearchTerm: false,
                    error: null
                });
            })
            .catch(error => {
                this.setState({error});
            });
    
    
        this.setState({isSubmitted: true});     
    }

    onButtonClick = (event) =>{
        this.setState({seller: event.target.value});  

    }


    render(){
        const {title, price, note, url, error} = this.state;
        const isInvalid = 
            url === '';
        return (
            <div style ={{margin: 70}}>
                <Menu>
                    <Menu.Item as={Link} to={ROUTES.SHOP_ETSY} >Shop Etsy</Menu.Item>
                    <Menu.Item active={true}>Shop via Links</Menu.Item>
                </Menu>
                <form className = "ui form" onSubmit = {this.onSubmit}>
                    
                    <Segment stacked className = "very padded">
                      <Grid columns={2} stackable>
                        <Grid.Column width={16}>
                            <h4>Paste an URL you would like to add to your wishlist here</h4>
                            <Form.Input
                                name = "url"
                                value = {url}
                                onChange = {this.onChange}
                                type = "text"
                                placeholder = "https://www."
                            />
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <h4>Who is the Seller?</h4>
                                <Button value = "Amazon" type = "button" style = {{marginTop: 10}} onClick = {this.onButtonClick}>Amazon</Button>
                                <Button value = "Ebay" type = "button" style = {{marginTop: 10}} onClick = {this.onButtonClick}>Ebay</Button>
                                <Button value = "Etsy" type = "button" style = {{marginTop: 10}} onClick = {this.onButtonClick}>Etsy</Button>
                                <Button value = "Other" type = "button" style = {{marginTop: 10}} onClick = {this.onButtonClick}>Other</Button>         
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <h4>Name of Item (Optional)</h4>
                            <Form.Input
                                name = "title"
                                value = {title}
                                onChange = {this.onChange}
                                type = "text"
                                placeholder = "T-shirt"
                            />
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <h4>Price (Optional)</h4>
                            <Form.Input
                                name = "price"
                                value = {price}
                                onChange = {this.onChange}
                                type = "text"
                                placeholder = "9.99"
                            />
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <h4>Notes (Optional)</h4>
                            <Form.Input
                                name = "note"
                                value = {note}
                                onChange = {this.onChange}
                                type = "text"
                                placeholder = "I am a size small"
                            />
                        </Grid.Column>
                      </Grid>
                        <button className = "ui button " disabled = {isInvalid} type = "submit" style = {{marginTop: 10}}>Add to Wishlist</button>
                        <p style={{color: 'green'}}>{this.state.isSubmitted? "Success! Added to wishlist." : null}</p>
                        {error && <p>{error}</p>} 
                    </Segment>
                </form>
                
                
            
            </div>
        );
    }
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AddLinkPage);
