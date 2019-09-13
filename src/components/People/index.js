import React from 'react';
import {Card, Grid, Menu} from 'semantic-ui-react';
import Avatar from '../Avatar';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import FollowUnfollowButton from '../FollowUnfollowButton';
import * as ROUTES from '../../constants/routes';
import {Link, withRouter} from 'react-router-dom';



class PeoplePage extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          loading: false,
          profiles: [],
          uid: this.props.firebase.currentUser().uid,
          currentLanguage: null,
        };
      }
    
      componentDidMount() {
        
        this.setState({ loading: true });

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

        // Grab current language selection

        this.props.firebase.getLanguage(this.state.uid).on('value', snapshot => {

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
        this.props.firebase.profiles().off();
        this.props.firebase.getLanguage().off();
        this.isUnmounted = true;
        
      }
    
      render() {
        const { profiles, currentLanguage, loading } = this.state;
        return (


          <div style = {{margin: 70}}>

            <Menu>
              <Menu.Item active={true}>
                  {currentLanguage === 'english' ? 
                        <div>All users</div>:
                        <div>모든 사용자</div>
                  } 
                </Menu.Item>
                <Menu.Item as={Link} to={ROUTES.FOLLOWING}>
                  {currentLanguage === 'english' ? 
                        <div>Following</div>:
                        <div>팔로우</div>
                  } 
                </Menu.Item>
                <Menu.Item as={Link} to={ROUTES.SEARCH}>
                  {currentLanguage === 'english' ? 
                        <div>Search</div>:
                        <div>검색</div>
                  } 
              </Menu.Item>
            </Menu>
            <div>
              {loading && <div>Loading ...</div>}
              {profiles ? (
                  <ProfileList profiles={profiles} currentLanguage = {currentLanguage}/>
              ) : (
                  <div>There are no profiles ...</div>
              )}
            </div>
        </div>

        );
      }
}


const ProfileList = ({ profiles, currentLanguage}) => (
  <Grid stackable columns={4}>
    {profiles.map(profile => (
      <Grid.Column key={profile.uid}>
      <Card centered>
        <Link to={{pathname: `/user/${profile.uid}`, params: profile.uid}}>
          <Avatar uid = {profile.uid} photoUrl = {profile.photoUrl}/>
        </Link>
        <Card.Content>
          <Card.Header>{profile.firstName} {profile.lastName}</Card.Header>
          <Link to={{pathname: `/user/${profile.uid}`, params: profile.uid}} >
            {currentLanguage === 'english' ? 
                <div>Profile</div>:
                <div>프로필</div>
            }
          </Link>
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



const condition = authUser => !!authUser;

export default withAuthorization(condition)(PeoplePage);

