import React from 'react';
import {withAuthorization } from '../Session';
import GiftReceivingTimesForm from '../GiftReceivingTimes';
import UpdateAvatar from '../UpdateAvatar';
import {withRouter} from 'react-router-dom';
import {Grid, Segment, Card} from 'semantic-ui-react';
import MyWishlistPage from '../MyWishlist';
import FollowingModule from '../FollowingModule'

class HomePage extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            loading: false,
            photoUrl: '',
            uid: this.props.firebase.currentUser().uid,
            firstName: '',
            currentLanguage: null,
            error: null
        };
    }
    componentDidMount(){

        const {uid} = this.state;

        // Grab current language selection

        this.props.firebase.getLanguage(uid).on('value', snapshot => {

            if (this.isUnmounted) {
                return;
            }
            
            const language = snapshot.val();

            if (language){
                this.setState({currentLanguage: language.language});
            }
            else{
                this.props.firebase.setLanguage(uid, 'english')
                    .catch(error => {
                        this.setState({error});
                    });
            }
            
        });


        // Grab first name
        this.props.firebase.getFirstName(uid).on('value', snapshot => {
            if (this.isUnmounted) {
              return;
            }
            const firstName = snapshot.val();
            this.setState({ firstName})
          });

        // Grab photo url
        this.props.firebase.getPhotoUrl(uid).on('value', snapshot => {
            if (this.isUnmounted) {
              return;
            }
            const photoUrl = snapshot.val();
            this.setState({ photoUrl})
          });

    }


    render(){
        const {currentLanguage, firstName, uid} = this.state;
        return (
            <div style = {{margin: 70}}>
                
                {currentLanguage === 'english' ? 
                    <h1>Welcome Back to Eudora, {firstName}!</h1>:
                    <h1>Eudora에 다시 오신 것을 환영합니다, {firstName}님!</h1>
                } 
                <Grid columns={2} stackable textAlign = "center" verticalAlign = "top">
                    <Grid.Column>
                        {currentLanguage === 'english' ? 
                            <h3>Your Wishlist</h3>:
                            <h3>당신의 위시리스트</h3>
                        }
                        <Segment>
                            <MyWishlistPage smallerView={true}/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        {currentLanguage === 'english' ? 
                            <h3>Following</h3>:
                            <h3> 당신의 팔로우</h3>
                        }
                        <Segment>
                            <FollowingModule/>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        {currentLanguage === 'english' ? 
                            <h3>Update your avatar</h3>:
                            <h3> 당신의 프로필 사진 업데이트</h3>
                        }
                        <Card centered>
                            <UpdateAvatar uid = {uid}/>
                        </Card>
                    </Grid.Column>
                    <Grid.Column >
                        {currentLanguage === 'english' ? 
                            <h3>Update your info</h3>:
                            <h3> 당신의 정보를 업데이트</h3>
                        }
                        <GiftReceivingTimesForm/>
                    </Grid.Column>
                </Grid>
               
            </div>
        );

    }
    
};

const condition = authUser => !!authUser;

export default withRouter(withAuthorization(condition)(HomePage));
