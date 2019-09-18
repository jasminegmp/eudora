import React from 'react';
import {Card, Grid, Menu} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import {Link, withRouter} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import Avatar from '../Avatar';


class FollowingPage extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          loading: false,
          following: [],
          followingProfiles: [],
          uid: this.props.firebase.currentUser().uid,
          currentLanguage: null,
        };
      }
    
      componentDidMount() {

        const {uid, following} = this.state;
        
        this.setState({ loading: true });

        // Grab current language selection

        this.props.firebase.getLanguage(uid).on('value', snapshot => {

          if (this.isUnmounted) {
              return;
          }
          
          const language = snapshot.val();

          if (language){
              this.setState({currentLanguage: language.language});
          }
            
        });
    
        // first get following list which will contain uids
        this.props.firebase.following(uid).on('value', snapshot => {
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
                if (following){
                  profilesList.map(profile => {
                      const found = this.state.following.some(followingPerson => profile.uid === followingPerson.uid);
                      if (found) {
                          tempArray.push(profile);
                      }
                      return tempArray;
                  });
                
                  this.setState({ followingProfiles: tempArray, loading: false });
                } else {
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
        const { followingProfiles, loading, currentLanguage } = this.state;
        return (


          <div style = {{margin: 70}}>
          <Menu>
              <Menu.Item as={Link} to={ROUTES.PEOPLE} >
                {currentLanguage === 'english' ? 
                      <div>All users</div>:
                      <div>모든 사용자</div>
                } 
              </Menu.Item>
              <Menu.Item active={true}>
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
              {followingProfiles ? (
                  <ProfileList profiles={followingProfiles} currentLanguage = {currentLanguage}/>
              ) : (
                  <div>
                    {currentLanguage === 'english' ? 
                      <div>You are not following anyone ...</div>:
                      <div>귀하는 아무도 팔로우하지 않습니다...</div>
                    } 
                  </div>
              )}
            </div>
          </div>
        );
      }
}


const ProfileList = ({ profiles, currentLanguage }) => (
  <Grid stackable columns={4}>
    {profiles.map(profile => (
      <Grid.Column key={profile.uid}>
      <Card centered>
        <Link to={{pathname: `/user/${profile.uid}`, params: profile.uid}} >
          <Avatar uid = {profile.uid} photoUrl = {profile.photoUrl}/>
        </Link>
        <Card.Content centered>
          <Card.Header>{profile.firstName} {profile.lastName}</Card.Header>
          <Link to={{pathname: `/user/${profile.uid}`, params: profile.uid}} >
            {currentLanguage === 'english' ? 
                <div>Profile</div>:
                <div>프로필</div>
            }
          </Link>
          <Card.Meta>
            <p>{profile.username}</p>
          </Card.Meta>
        </Card.Content>
      </Card>
      </Grid.Column>
    ))} 
  </Grid>
);



const condition = authUser => !!authUser;
export default withAuthorization(condition)(FollowingPage);

