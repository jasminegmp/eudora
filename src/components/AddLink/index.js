import React from 'react';
import {Segment, Form, Menu, Button, Grid} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import {Link} from 'react-router-dom';
import fetchJsonp from 'fetch-jsonp';

//https://openapi.etsy.com/v2/listings/612622551.js?&api_key=*
const PATH_BASE = 'https://openapi.etsy.com/v2';
const PATH_SEARCH = '/listings/';
const LISTING_PATH = '.js?'
const LISTING_IMAGE = '/images.js?'
const API_PATH = '&api_key=';
const ETSY_KEY = require('../../e_config').default;

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

    setSearchImage = result => {
        this.setState({image: result.results[0].url_170x135});
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

    getJsonResponse = async (event, path) => {
        const { price, url, note, id, title, image, seller, result, listingId} = this.state;
        const response = await fetchJsonp(path, {
          timeout: 10000,
        });
        await response.json()
          .then(result => this.setSearchImage(result))
          .then(this.setState({newSearchTerm: false}))
          .catch(error => console.log(error))
          .then(
            () => {this.uploadedDb(event)})
    }

    uploadedDb = event => {
        const { price, url, note, id, title, image, seller, result, listingId} = this.state;
        const user = this.props.firebase.currentUser();
        this.props.firebase.addWishlistDb(user.uid, title, url, image, id, price, false, note, seller)
        .then(this.setState({            
            title: '',
            price : '',
            note: '',
            url: '',
            id: null,
            image: '',
            seller: null,
            isSubmitted: false,
            newSearchTerm: false,
            error: null}))
        .catch(error => {
            this.setState({error});
        });
    }

    onSubmit =  async (event) => {

        const { price, url, note, id, title, image, seller, result, listingId} = this.state;
        


        event.preventDefault();


        if (seller === 'Etsy'){
            // extract listing ID from link
            // length of this is 29 "https://www.etsy.com/listing/"
            let substrUrl = (url.slice(29)).split('/')[0];

            // make API call to etsy to get information of data
            this.setState( async () => {
                const path = `${PATH_BASE}${PATH_SEARCH}${substrUrl}${LISTING_IMAGE}${API_PATH}${ETSY_KEY}`;
                console.log(path);
                this.setState({path});
                this.getJsonResponse(event, path);

                }
            );
        }
        else{
            this.uploadedDb(event);
        }


            //reassign values to pass into DB from API call to etsy
            
/*
            // make API call to etsy to get image
            this.setState({listingId: substrUrl.slice(0,9)}, async () => {
                const path = `${PATH_BASE}${PATH_SEARCH}${this.state.listingId}${LISTING_IMAGE}${API_PATH}${ETSY_KEY}`;
                console.log(path);
                this.setState({path});
                this.getJsonResponse(event, path);  
            });*/
    
    
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
                                <Button value = "Etsy" type = "button" style = {{marginTop: 10}} onClick = {this.onButtonClick}>Etsy</Button>
                                <Button value = "Ebay" type = "button" style = {{marginTop: 10}} onClick = {this.onButtonClick}>Ebay</Button>
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
