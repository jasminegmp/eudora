import React from 'react';
import {Image, Card, Grid} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

const PeoplePage = () => {
    return (
        <Grid>
            <Grid.Column style = {{margin: 50}}>
                <h1>People</h1>
                <Profiles/>
             </Grid.Column>
        </Grid>
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
  <div className="ui stackable grid">
    {profiles.map(profile => (
      <Card centered key={profile.uid}>
        <Image src={profile.photoUrl} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{profile.firstName} {profile.lastName}</Card.Header>
          <Card.Meta>
            <p>{profile.username}</p>
          </Card.Meta>
        </Card.Content>
      </Card>
    ))} 
  </div>
);


const Profiles = withFirebase(ProfilesBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PeoplePage);
