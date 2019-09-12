import React from 'react';
import {Search, Menu, Label} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import {Link, withRouter} from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';


const options = [
    {
      "title": "Terry - Dietrich",
      "description": "Open-architected static functionalities",
      "image": "https://s3.amazonaws.com/uifaces/faces/twitter/brandonmorreale/128.jpg",
      "price": "$92.85"
    },
    {
      "title": "Doyle, Hane and O'Connell",
      "description": "Virtual zero defect standardization",
      "image": "https://s3.amazonaws.com/uifaces/faces/twitter/artvavs/128.jpg",
      "price": "$15.17"
    },
    {
      "title": "Leffler, Hartmann and Gusikowski",
      "description": "Operative executive strategy",
      "image": "https://s3.amazonaws.com/uifaces/faces/twitter/HenryHoffman/128.jpg",
      "price": "$96.27"
    },
    {
      "title": "Schneider - Buckridge",
      "description": "Vision-oriented demand-driven interface",
      "image": "https://s3.amazonaws.com/uifaces/faces/twitter/uxward/128.jpg",
      "price": "$65.29"
    },
    {
      "title": "Wisoky - Goyette",
      "description": "Devolved executive productivity",
      "image": "https://s3.amazonaws.com/uifaces/faces/twitter/alan_zhang_/128.jpg",
      "price": "$69.02"
    }
  ];

const resultRenderer = ({ firstName, lastName }) => <Label content={(firstName + " " + lastName) } />

    resultRenderer.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
}
  

class SearchForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            initialState: null,
            isLoading: false,
            results: null,
            profiles: [],
            selectedUid: null,
            options: options,
            photoUrl: null,
            value: '',

        };

    }

    componentDidMount() {
    
        this.props.firebase.profiles().on('value', snapshot => {
          if (this.isUnmounted) {
            return;
          }

          // convert messages list from snapshot
    
          const profilesObject = snapshot.val();

          if (profilesObject) {
            // convert messages list from snapshot
            const profilesList = Object.keys(profilesObject).map(key => ({
              ...profilesObject[key],
              uid: key,
            }));
      

            this.setState({ profiles: profilesList, loading: false });
          } else {
            this.setState({profiles: null, loading: false });
          }
        });
      }

    handleResultSelect = (e, { result }) => {
        this.setState({ value:  (result.firstName + " " + result.lastName), selectedUid: (result.uid)})
        
        
    }
  
    handleSearchChange = (e, { value }) => {
      this.setState({ isLoading: true, value })
  
      setTimeout(() => {
        if (this.state.value.length < 1) return this.setState(this.state.initialState)
  
        const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
        const isMatch = (result) => re.test((result.firstName + " " + result.lastName) )
  
        this.setState({
          isLoading: false,
          results: _.filter(this.state.profiles, isMatch),
        })
      }, 300)
    }


    render(){
        const { isLoading, value, results } = this.state
        return(
            <div style = {{margin: 70}}>
            <Menu>
                <Menu.Item as={Link} to={ROUTES.PEOPLE} >All Users</Menu.Item>
                <Menu.Item as={Link} to={ROUTES.FOLLOWING}>Following</Menu.Item>
                <Menu.Item active={true}>Search</Menu.Item>
                
            </Menu>
            <Search
                resultRenderer={resultRenderer}
                loading={isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                leading: true,
                })}
                results={results}
                value={value}
            />
            </div>
        );
    }
}


const condition = authUser => authUser;

export default withAuthorization(condition)(withFirebase(SearchForm));