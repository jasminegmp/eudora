import React from 'react';
import {Image, Card, Grid} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import FollowUnfollowButton from '../FollowUnfollowButton'
import {Link, withRouter} from 'react-router-dom';

const PeoplePage = () => {
    return (
        <div style = {{margin: 70}}>
          <Profiles/>
        </div>
    );
};

class ProfilesBase extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          loading: false,
          profiles: [],
        };
      }
    
      componentDidMount() {
        
        this.setState({ loading: true });
    
        this.props.firebase.profiles().on('value', snapshot => {
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
    
      componentWillUnmount() {
        this.props.firebase.profiles().off();
      }
    
      render() {
        const { profiles, loading } = this.state;
        return (
          <div>
            {loading && <div>Loading ...</div>}
            {profiles ? (
                <ProfileList profiles={profiles} />
            ) : (
                <div>There are no profiles ...</div>
            )}
          </div>
        );
      }
}


const ProfileList = ({ profiles }) => (
  <Grid stackable columns={4}>
    {profiles.map(profile => (
      <Grid.Column key={profile.uid}>
      <Card centered>
        <Image src={profile.photoUrl} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{profile.firstName} {profile.lastName}</Card.Header>
          <Link to={{pathname: `/eudora/user/${profile.uid}`, params: profile.uid}} >Wishlist</Link>
          <Card.Meta>
            <p>{profile.username}</p>
            <FollowUnfollowButton targetUid = {profile.uid}/>
          </Card.Meta>
        </Card.Content>
      </Card>
      </Grid.Column>
    ))} 
  </Grid>
);


const Profiles = withRouter(withFirebase(ProfilesBase));

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PeoplePage);

