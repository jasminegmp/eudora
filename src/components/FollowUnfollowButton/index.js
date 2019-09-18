import React from 'react';
import { withAuthorization } from '../Session';


class PurchasedItem extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            uid: '',
            targetUid: this.props.targetUid,
            followingUid: null,
            following: [],
            currentLanguage: null,
            error: null
        };
    }

    componentDidMount(){

        const {targetUid} = this.state;

        const user = this.props.firebase.currentUser();
        this.setState({uid: user.uid});

        // Grab current following list and check if already follwoing
        this.props.firebase.getFollowingList(user.uid).on('value', snapshot => {
            if (this.isUnmounted) {
                return;
            }
    
            const followingObject = snapshot.val();
  
            if (followingObject) {
             
              if (targetUid in followingObject){
                this.setState({followingUid: true }); //already following
              }
              else{
                this.setState({followingUid: false }); // not yet following
              }

              
              
            } else {
              this.setState({followingUid: false });
            }
          });

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


    onClickFollow = (event) => {
        const {uid, targetUid} = this.state;
        // update following list
        this.props.firebase.addFollowingList(uid, targetUid)
            .catch(error => {
                this.setState({error});
            });

    }

    onClickUnfollow = (event) => {
        const {uid, targetUid} = this.state;
        // update following list
        this.props.firebase.removeFollowingList(uid, targetUid)
            .catch(error => {
                this.setState({error});
            });

    }
    
      

    render(){
        const {currentLanguage, uid, targetUid, followingUid} = this.state;
        return(
            <div>   
                {uid !== targetUid && !followingUid ? <button className = "ui button primary" onClick = {this.onClickFollow} >
                    {currentLanguage === 'english' ? 
                        <div>Follow</div>:
                        <div>팔로우</div>
                    } 
                </button> : null }
                {uid !== targetUid && followingUid ? <button className = "ui button red"  onClick = {this.onClickUnfollow} >
                {currentLanguage === 'english' ? 
                        <div>Unfollow</div>:
                        <div>팔로우 취소</div>
                } 
                </button> : null }
                
                
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PurchasedItem);