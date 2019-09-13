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
        const user = this.props.firebase.currentUser();
        this.setState({uid: user.uid});

        // Grab current following list and check if already follwoing
        this.props.firebase.getFollowingList(user.uid).on('value', snapshot => {
            if (this.isUnmounted) {
                return;
            }
    
            const followingObject = snapshot.val();
  
            if (followingObject) {
             
              if (this.state.targetUid in followingObject){
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
        //console.log(this.state.uid, this.state.targetUid, this.state.following);
        // update following list
        this.props.firebase.addFollowingList(this.state.uid, this.state.targetUid)
            .catch(error => {
                this.setState({error});
            });

    }

    onClickUnfollow = (event) => {
        //console.log(this.state.uid, this.state.targetUid, this.state.following);
        // update following list
        this.props.firebase.removeFollowingList(this.state.uid, this.state.targetUid)
            .catch(error => {
                this.setState({error});
            });

    }
    
      

    render(){
        const {currentLanguage} = this.state;
        return(
            <div>   
                {this.state.uid !== this.state.targetUid && !this.state.followingUid ? <button className = "ui button primary" onClick = {this.onClickFollow} >
                    {currentLanguage === 'english' ? 
                        <div>Follow</div>:
                        <div>팔로우</div>
                    } 
                </button> : null }
                {this.state.uid !== this.state.targetUid && this.state.followingUid ? <button className = "ui button red"  onClick = {this.onClickUnfollow} >
                {currentLanguage === 'english' ? 
                        <div>Unollow</div>:
                        <div>팔로우 취소</div>
                } 
                </button> : null }
                
                
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PurchasedItem);

/* */