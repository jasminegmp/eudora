import React from 'react';
import {Icon} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import {Link} from 'react-router-dom';

class PurchasedItem extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            followingCount: null,
            currentLanguage: null,
            error: null
        };
    }

    componentDidMount(){

        const user = this.props.firebase.currentUser();

        // Grab current following list and check if already follwoing
        this.props.firebase.getFollowingList(user.uid).on('value', snapshot => {
            if (this.isUnmounted) {
                return;
              }
    
            const followingObject = snapshot.val();
  
            if (followingObject) {
                
              Object.keys(followingObject).map(key => ({
                ...followingObject[key],
                uid: key,
              }));
             
              
                this.setState({followingCount: Object.keys(followingObject).length });

              
              
            } else {
              this.setState({followingCount: 0 });
            }
          });
          //console.log(this.state.followingCount)
          this.props.firebase.getLanguage(user.uid).on('value', snapshot => {
  
            if (this.isUnmounted) {
                return;
            }
            
            const language = snapshot.val();
    
            if (language){
                this.setState({currentLanguage: language.language});
            }
            
        });
    }

    componentWillUnmount() {
        this.props.firebase.getFollowingList().off();
        this.isUnmounted = true;
      }


      

    render(){
      const {currentLanguage, followingCount} = this.state;
        
        return(
            <div>   
                <Link to={ROUTES.FOLLOWING} ><Icon name='users' /> 
                
              {currentLanguage === 'english' ? 
                  <div>Following {followingCount} Users</div>:
                  <div>팔로우 {followingCount}분</div>
              } 
                </Link>
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PurchasedItem);

/* */