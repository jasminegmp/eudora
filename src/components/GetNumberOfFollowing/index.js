import React from 'react';
import {Icon} from 'semantic-ui-react';
import { withAuthorization } from '../Session';


class PurchasedItem extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            followingCount: null,
            error: null
        };
    }

    componentDidMount(){

        const user = this.props.firebase.currentUser();

        // Grab current following list and check if already follwoing
        this.props.firebase.getFollowingList(user.uid).on('value', snapshot => {
    
            const followingObject = snapshot.val();
  
            if (followingObject) {
                
              const followingList = Object.keys(followingObject).map(key => ({
                ...followingObject[key],
                uid: key,
              }));
             
              
                this.setState({followingCount: Object.keys(followingObject).length });

              
              
            } else {
              this.setState({followingCount: 0 });
            }
          });
          console.log(this.state.followingCount)
    }

    componentWillUnmount() {
        this.props.firebase.getFollowingList().off();
      }


      

    render(){
        
        return(
            <div>   
                <Icon name='users' /> Following {this.state.followingCount} Users
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PurchasedItem);

/* */