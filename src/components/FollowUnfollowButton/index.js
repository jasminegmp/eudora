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
            error: null
        };
    }

    componentDidMount(){
        const user = this.props.firebase.currentUser();
        this.setState({uid: user.uid});

        // Grab current following list and check if already follwoing
        this.props.firebase.getFollowingList(user.uid).on('value', snapshot => {
    
            const followingObject = snapshot.val();
  
            if (followingObject) {
                
              const followingList = Object.keys(followingObject).map(key => ({
                ...followingObject[key],
                uid: key,
              }));
             
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
    }

    componentWillUnmount() {
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
        
        return(
            <div>   
                {this.state.uid !== this.state.targetUid && !this.state.followingUid ? <button className = "ui button primary" onClick = {this.onClickFollow} >Follow</button> : null }
                {this.state.uid !== this.state.targetUid && this.state.followingUid ? <button className = "ui button red"  onClick = {this.onClickUnfollow} >Unfollow</button> : null }
                
                
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PurchasedItem);

/* */