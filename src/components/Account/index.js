import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import {Grid, Card, Header} from 'semantic-ui-react';
import GiftReceivingTimesForm from '../GiftReceivingTimes';
import PasswordChangeForm from '../PasswordChange';
import UpdateAvatar from '../UpdateAvatar';
import 'firebase/storage';
import GetNumberOfFollowing from '../GetNumberOfFollowing';
import ChangeLanguagesForm from '../ChangeLanguages';

class AccountPage extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            photoUrl: '',
            uid: this.props.firebase.currentUser().uid,
            currentLanguage: null,
            error: null
        };
    }

    componentDidMount(){

        const {uid} = this.state;

        // Grab photo url
        this.props.firebase.getPhotoUrl(uid).on('value', snapshot => {
            if (this.isUnmounted) {
              return;
            }
            const photoUrl = snapshot.val();
            this.setState({ photoUrl})
          });
        
          this.props.firebase.getLanguage(uid).on('value', snapshot => {
  
            if (this.isUnmounted) {
                return;
            }
            
            const language = snapshot.val();
    
            if (language){
                this.setState({currentLanguage: language.language});
            }
            
        });

    }


    render(){
        const {currentLanguage, uid} = this.state;
        return (
            <AuthUserContext.Consumer>
            {authUser => (
                    <Grid textAlign = "center" verticalAlign = "middle" style = {{marginTop: 70, marginBottom: 70}}>
                        <Grid.Column style = {{maxWidth: 420}}>
                            <Header as = "h2" color = "grey" textAlign = "center">
                                {currentLanguage === 'english' ? 
                                    <h1>Account Settings</h1>:
                                    <h1>계정 설정</h1>
                                } 
                            </Header>
                            <Card centered>
                                <UpdateAvatar uid = {uid}/>
                                <Card.Content>
                                <Card.Header>{authUser.displayName}</Card.Header>
                                <Card.Meta>
                                    <p>{authUser.email}</p>
                                </Card.Meta>
                                <Card.Description>
                                    <p>Joined on {authUser.metadata.creationTime}}</p>
                                </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                        <GetNumberOfFollowing />
                                </Card.Content>
                            </Card>
        
                            <Header as = "h2" color = "grey" textAlign = "center">
                                <GiftReceivingTimesForm/>
                            </Header>
                            <Header as = "h2" color = "grey" textAlign = "center">
                                {currentLanguage === 'english' ? 
                                    <h1>Change Languages</h1>:
                                    <h1>언어</h1>
                                } 
                            </Header>
                                 <ChangeLanguagesForm/>
                            <Header as = "h2" color = "grey" textAlign = "center">
                                {currentLanguage === 'english' ? 
                                    <h1>Change Password</h1>:
                                    <h1>비밀번호</h1>
                                } 
                                
                            </Header>
                            <PasswordChangeForm/>                       
                        </Grid.Column>
                    </Grid>
            )}
            </AuthUserContext.Consumer>
        )
    }

};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);