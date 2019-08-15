import React from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { withRouter} from 'react-router-dom';
import FetchProfileInfo from '../FetchProfileInfo';

const PersonProfilePage = () => {
    return (
        <div style = {{margin: 70}}>
          <Person/>
        </div>
    );
};

class PersonProfileBase extends React.Component {
    constructor(props){

        super(props);
        this.state = {
            uid: null
        }
    }

    render() {
        return(
            <div>
            <FetchProfileInfo uid = {this.props.match.params.uid}/>
            </div>
        )
    }
}

const Person = withRouter(withFirebase(PersonProfileBase));

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PersonProfilePage);

