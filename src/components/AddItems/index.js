import React from 'react';
import fetchJsonp from 'fetch-jsonp';
import {Segment, Form, Dropdown, Loader, Dimmer} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import ItemList from '../ItemList'


//https://openapi.etsy.com/v2/listings/active.js?keywords=ring&limit=12&includes=Images:1&api_key=*
const PATH_BASE = 'https://openapi.etsy.com/v2';
const PATH_SEARCH = '/listings/active.js?callback=getData&keywords=';
const LIMIT_PARAM = 'limit=';
const IMAGE_PARAM = 'includes=Images:1'
const API_PATH = 'api_key=';
const ETSY_KEY = require('../../e_config').default;

const limitOptions = [
    {
      key: '10',
      text: '10',
      value: '10',
    },
    {
      key: '20',
      text: '20',
      value: '20',
    },
    {
      key: '50',
      text: '50',
      value: '50',
    },
    {
      key: '100',
      text: '100',
      value: '100',
    }
  ]


class AddItemsPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            limit: '',
            searchTerm: '',
            result: null,
            isSubmitted: false,
            isLoading: false,
            error: null
        }
    }

    setSearchItems = result => {
        this.setState({result: result.results});
    }

    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value});

    }

    onSubmit =  async (event) => {
        console.log("onsubmit");
        const path = `${PATH_BASE}${PATH_SEARCH}${this.state.searchTerm}&${LIMIT_PARAM}${this.state.limit}&${IMAGE_PARAM}&${API_PATH}${ETSY_KEY}`;
        console.log(path);
        const response = await fetchJsonp(path, {
            timeout: 10000,
          });
          const json = await response.json()
            .then(result => this.setSearchItems(result))
            .then(this.setState({isLoading: false}, () => {console.log(this.state.isLoading);}))
            .catch(error => console.log(error));
        
        this.setState({isSubmitted: true});
        
            
    }

    isLoading = (event) => {
      console.log("isloading");
      event.preventDefault();
      this.setState({isLoading: true}, () => {this.onSubmit().catch(e => {
        // handle error
      })});

      
    }

    handleDropdownUpdate = (event, data) =>{
      this.setState({limit: data.value});
      
    }

    render(){
        const {searchTerm, error} = this.state;
        return (
            <div>
                <form className = "ui form" onSubmit = {this.isLoading}>
                    <Segment stacked>
                    {this.state.isLoading ? 
                      <Dimmer active inverted>
                        <Loader inverted>Loading</Loader>
                      </Dimmer> 
                      : 
                      null
                    }

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
                        <Dropdown
                            placeholder='Number of items'
                            fluid
                            selection
                            options={limitOptions}
                            value = {this.state.limit}
                            onChange={this.handleDropdownUpdate}
                        />
                        <button className = "ui button " type = "submit" >Search</button>
                        {error && <p>{error}</p>} 
                        
                    </Segment>
                    <div>
                      {this.state.isSubmitted && <ItemList result={this.state.result} />}
                    </div>
                </form>
                
            
            </div>
        );
    }
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AddItemsPage);
