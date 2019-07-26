import React from 'react';
import axios from 'axios';
import { withAuthorization } from '../Session';


//https://openapi.etsy.com/v2/listings/active.js?keywords=ring&limit=12&includes=Images:1&api_key=*
const EUDORA_PATH = 'https://jasminegmp.github.io/eudora/my-wishlist/'
const PATH_BASE = 'https://openapi.etsy.com/v2';
const PATH_SEARCH = '/listings/active.js?keywords=';
const DEFAULT_QUERY = 'ring';
const LIMIT_PARAM = 'limit=';
const LIMIT_COUNT = '12';
const IMAGE_PARAM = 'includes=Images:1'
const API_PATH = 'api_key=';
const ETSY_KEY = require('../../e_config').default;

class WishlistPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY
        }
    }

    setSearchItems = result => {
        this.setState({result});
    }

    async componentDidMount() {
        const {searchTerm} = this.state;
        const path = `${PATH_BASE}${PATH_SEARCH}${DEFAULT_QUERY}&${LIMIT_PARAM}${LIMIT_COUNT}&${IMAGE_PARAM}&${API_PATH}${ETSY_KEY}`;
        
        const response = await axios.get(path);
        this.setState({result: response.data.data});
    }

    render(){
        return (
            <div>
                <h1>My Wishlist</h1>
            
            </div>
        );
    }
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WishlistPage);
