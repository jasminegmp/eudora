import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import {Grid, Card, Image, Header} from 'semantic-ui-react';
import GiftReceivingTimesForm from '../GiftReceivingTimes';
import PasswordChangeForm from '../PasswordChange';
import UpdateAvatar from '../UpdateAvatar';
import 'firebase/storage';
import Avatar from '../Avatar';
import GetNumberOfFollowing from '../GetNumberOfFollowing';

class AccountPage extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            photoUrl: '',
            uid: this.props.firebase.currentUser().uid,
            error: null
        };
    }

    componentDidMount(){

        // Grab photo url
        this.props.firebase.getPhotoUrl(this.state.uid).on('value', snapshot => {
            if (this.isUnmounted) {
              return;
            }
            const photoUrl = snapshot.val();
            this.setState({ photoUrl})
          });

    }


    render(){
        return (
            <AuthUserContext.Consumer>
            {authUser => (
                    <Grid textAlign = "center" verticalAlign = "middle" style = {{marginTop: 70, marginBottom: 70}}>
                        <Grid.Column style = {{maxWidth: 420}}>
                        <Header as = "h2" color = "grey" textAlign = "center">
                            Account Settings
                        </Header>
                        <Card centered>
                            <Avatar uid = {this.state.uid} photoUrl = {this.state.photoUrl}/>
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
                            What do you celebrate?
                            <GiftReceivingTimesForm/>
                        </Header>
    
                        <Header as = "h2" color = "grey" textAlign = "center">
                            Change Password
                        </Header>
                        <PasswordChangeForm/>
    
                        <Header as = "h2" color = "grey" textAlign = "center">
                            Change Avatar
                        </Header>
                        <UpdateAvatar/>
    
                        </Grid.Column>
                    </Grid>
            )}
            </AuthUserContext.Consumer>
        )
    }

};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);