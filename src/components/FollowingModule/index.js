import React from 'react';
import {Card, Grid, Menu} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import {Link, withRouter} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Avatar from '../Avatar';


class FollowingModule extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          loading: false,
          following: [],
          followingProfiles: [],
          uid: this.props.firebase.currentUser().uid,
        };
      }
    
      componentDidMount() {
        
        this.setState({ loading: true });
    
        // first get following list which will contain uids
        this.props.firebase.following(this.state.uid).on('value', snapshot => {
            if (this.isUnmounted) {
                return;
            }
    
    
          const followingObject = snapshot.val();

          if (followingObject) {
            const followingList = Object.keys(followingObject).map(key => ({
              ...followingObject[key],
              uid: key,
            }));
      

            this.setState({ following: followingList, loading: false });
          } else {
            this.setState({following: null, loading: false });
          }
        });

        // now map those uids to profiles
        this.props.firebase.profiles().on('value', snapshot => {
            if (this.isUnmounted) {
                return;
            }
    
      
            const profilesObject = snapshot.val();
            const tempArray = [];
            if (profilesObject) {
                const profilesList = Object.keys(profilesObject).map(key => ({
                    ...profilesObject[key],
                    uid: key,
                }));
                if (this.state.following){
                profilesList.map(profile => {
                    const found = this.state.following.some(followingPerson => profile.uid === followingPerson.uid);
                    if (found) {
                        tempArray.push(profile);
                    }
                    return tempArray;
                });
                
                this.setState({ followingProfiles: tempArray, loading: false });
                } 
                else {
                this.setState({followingProfiles: null, loading: false });
                }
            }
          });

      }
    
      componentWillUnmount() {
        this.props.firebase.profiles().off();
        this.props.firebase.following().off();
        this.isUnmounted = true;
        
      }
    
      render() {
        const { followingProfiles, loading } = this.state;
        return (
          <div>
            {loading && <div>Loading ...</div>}
            {followingProfiles ? (
                <ProfileList profiles={followingProfiles} />
            ) : (
                <div>
                  <div>You are not following anyone ...</div>
                  <Link to={ROUTES.PEOPLE}>
                    <button style={{width: "50%", margin: "auto", margin: "20px"}} className = "ui button " type = "button"  >Discover People to Follow</button>
                  </Link>
                </div>
            )}
          </div>
        );
      }
}


const ProfileList = ({ profiles }) => (
  <div>
    <Grid stackable columns={2}>
      {profiles.slice(0, 4).map(profile => (
        <Grid.Column key={profile.uid}>
        <Card centered>
          <Link to={{pathname: `/user/${profile.uid}`, params: profile.uid}} >
            <Avatar uid = {profile.uid} photoUrl = {profile.photoUrl}/>
          </Link>
          <Card.Content>
            <Card.Header>{profile.firstName} {profile.lastName}</Card.Header>
            <Link to={{pathname: `/user/${profile.uid}`, params: profile.uid}} >Wishlist</Link>
            <Card.Meta>
              <p>{profile.username}</p>
            </Card.Meta>
          </Card.Content>
        </Card>
        </Grid.Column>
      ))} 
    </Grid>
    <Grid.Column>
        <Link to={ROUTES.FOLLOWING}>
          <button style={{width: "50%", margin: "auto", marginBottom: "10px", marginTop: "20px"}} className = "ui button " type = "button"  >See More Following</button>
        </Link>
      </Grid.Column>
    </div>
);


const condition = authUser => !!authUser;
export default withAuthorization(condition)(FollowingModule);

