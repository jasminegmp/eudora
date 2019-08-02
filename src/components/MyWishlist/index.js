import React from 'react';
import fetchJsonp from 'fetch-jsonp';
import {Segment, Form} from 'semantic-ui-react';
import { withAuthorization } from '../Session';


//https://openapi.etsy.com/v2/listings/active.js?keywords=ring&limit=12&includes=Images:1&api_key=*
const PATH_BASE = 'https://openapi.etsy.com/v2';
const PATH_SEARCH = '/listings/active.js?callback=getData&keywords=';
const LIMIT_PARAM = 'limit=';
const LIMIT_COUNT = '12';
const IMAGE_PARAM = 'includes=Images:1'
const API_PATH = 'api_key=';
const ETSY_KEY = require('../../e_config').default;

class WishlistPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            searchTerm: '',
            result: null,
            error: null
        }
    }

    setSearchItems = result => {
        this.setState({result});
    }

    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit = (event) => {
        let temp;
        event.preventDefault();
        const path = `${PATH_BASE}${PATH_SEARCH}${this.state.searchTerm}&${LIMIT_PARAM}${LIMIT_COUNT}&${IMAGE_PARAM}&${API_PATH}${ETSY_KEY}`;
        console.log(path);

        fetchJsonp(path, {
            timeout: 3000,
          })
            .then(response => response.json())
            .then(result => this.setSearchItems(result))
            .catch(error => console.log(error));
            
    }

    render(){
        const {searchTerm, error} = this.state;
        return (
            <div>
                <form className = "ui form" onSubmit = {this.onSubmit}>
                    <Segment stacked>
                        <div className="field">
                            <label>Search for Item</label>
                            <Form.Input
                                name = "searchTerm"
                                value = {searchTerm}
                                onChange = {this.onChange}
                                type = "text"
                                placeholder = "example: ring"
                            />
                        </div>
                        <button className = "ui button " type = "submit" >Search</button>
                        {error && <p>{error}</p>} 
                    </Segment>
                </form>
            
            </div>
        );
    }
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WishlistPage);
