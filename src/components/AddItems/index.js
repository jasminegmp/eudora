import React from 'react';
import fetchJsonp from 'fetch-jsonp';
import {Segment, Form, Dropdown, Loader, Dimmer, Grid, Menu} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import ItemList from '../ItemList';
import * as ROUTES from '../../constants/routes';
import {Link} from 'react-router-dom';


//https://openapi.etsy.com/v2/listings/active.js?keywords=ring&limit=12&includes=Images:1&api_key=*
const PATH_BASE = 'https://openapi.etsy.com/v2';
const PATH_SEARCH = '/listings/active.js?callback=getData&keywords=';
const LIMIT_PARAM = 'limit=';
const OFFSET_PARAM = 'offset='
const IMAGE_PARAM = 'includes=Images:1';
const API_PATH = 'api_key=';
const ETSY_KEY = require('../../e_config').default;

const limitOptions = [
    {
      key: '10',
      text: '10',
      value: 10,
    },
    {
      key: '50',
      text: '50',
      value: 50,
    },
    {
      key: '100',
      text: '100',
      value: 100,
    }
  ]


class AddItemsPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            limit: 10,
            newSearchTerm: false,
            searchTerm: '',
            result: null,
            isSubmitted: false,
            isLoading: false,
            offset: 0,
            error: null
        }
    }

    setSearchItems = result => {
        this.setState({result: result.results});
    }

    onChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
        this.setState({newSearchTerm: true});
    }

    getJsonResponse = async (event, path) => {
      const response = await fetchJsonp(path, {
        timeout: 10000,
      });
      await response.json()
        .then(result => this.setSearchItems(result))
        .then(this.setState({isLoading: false}))
        .then(this.setState({newSearchTerm: false}))
        .catch(error => console.log(error));
    }

    onSubmit =  async (event) => {
        const path = `${PATH_BASE}${PATH_SEARCH}${this.state.searchTerm}&${LIMIT_PARAM}${this.state.limit}&${OFFSET_PARAM}${this.state.offset}&${IMAGE_PARAM}&${API_PATH}${ETSY_KEY}`;
        if (this.state.newSearchTerm){
          this.setState({offset: 0}, async () => {
            this.getJsonResponse(event, path);  
          })}
        else{
          
          this.getJsonResponse(event, path);         
        }
        this.setState({isSubmitted: true});     
    }


    isLoading = (event) => {
      event.preventDefault();
      this.setState({isLoading: true}, () => {this.onSubmit().catch(e => {
        // handle error
      })});
    }

    handleDropdownUpdate = (event, data) =>{
      this.setState({limit: data.value});
    }

    nextPage = (event) => {
      const newOffset = this.state.offset + this.state.limit;
      this.setPage(newOffset, event);
    }

    prevPage = (event) => {
      const newOffset = this.state.offset - this.state.limit;;
      this.setPage(newOffset, event);
    }

    setPage = (newOffset, event) => {
      this.setState({offset: newOffset});
      this.isLoading(event);
    }

    render(){
        const {searchTerm, error, isLoading, isSubmitted, offset} = this.state;
        const isInvalid = 
          searchTerm === '';
        return (
            <div style ={{margin: 70}}>
              <Menu>
                <Menu.Item active={true}>Shop Etsy</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.ADD_LINK}>Shop via Links</Menu.Item>
              </Menu>
                <form className = "ui form" onSubmit = {this.isLoading}>
                    <Segment stacked className = "very padded">
                    {isLoading ? 
                      <Dimmer active inverted>
                        <Loader inverted>Loading</Loader>
                      </Dimmer> 
                      : 
                      null
                    }
                      <Grid columns={2} stackable>
                        <Grid.Column width={12}>
                            <h4>Search for Item</h4>
                            <Form.Input
                                name = "searchTerm"
                                value = {searchTerm}
                                onChange = {this.onChange}
                                type = "text"
                                placeholder = "example: ring"
                            />
                        </Grid.Column>
                        <Grid.Column width={4}> 
                          <h4>Results per Page</h4>
                          <Dropdown
                              placeholder='Number of items'
                              fluid
                              selection
                              options={limitOptions}
                              value = {this.state.limit}
                              onChange={this.handleDropdownUpdate}
                          />
                        </Grid.Column>
                      </Grid>
                        <button className = "ui button " disabled = {isInvalid} type = "submit" style = {{marginTop: 10}}>Search</button>
                        {error && <p>{error}</p>} 
                    </Segment>
                </form>

                    <div style = {{marginTop: 15, marginBottom: 25}}>
                      {isSubmitted && (offset >0) ?
                        <button className ="ui left labeled icon button" onClick = {this.prevPage} >
                          <i className ="left arrow icon"></i>
                          Prev
                        </button> :
                        <button className ="ui left labeled icon button"  disabled>
                        <i className ="left arrow icon"></i>
                        Prev
                      </button>
                      }
                      {isSubmitted ?
                        <button className ="ui right labeled icon button" onClick = {this.nextPage} >
                        <i className ="right arrow icon"></i>
                          Next
                        </button>
                        :
                        <button className ="ui right labeled icon button" disabled >
                        <i className ="right arrow icon"></i>
                          Next
                        </button>
                      }

                    </div>
                    
                    <div>
                      {this.state.isSubmitted && <ItemList result={this.state.result} />}
                    </div>
                
                
            
            </div>
        );
    }
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AddItemsPage);
