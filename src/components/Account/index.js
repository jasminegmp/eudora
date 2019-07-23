import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import {Grid, Card, Icon, Image, Header, Segment} from 'semantic-ui-react';
import PasswordChangeForm from '../PasswordChange';
import FileUploader from "react-firebase-file-uploader";
import { withFirebase } from '../Firebase';
import 'firebase/storage';
import app from 'firebase/app';
import {withRouter} from 'react-router-dom';

// a form
class ChangeAvatarBase extends React.Component {
    constructor(props){
        super(props);
        this.storage = app.storage();
        this.state = {
            username: "",
            avatar: "",
            isUploading: false,
            progress: 0,
            avatarURL: ""
        }
    }
    

    handleChangeUsername = event =>
        this.setState({ username: event.target.value });

    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

    handleProgress = progress => this.setState({ progress });

    handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
    };

    componentDidUpdate(){
        var user = this.props.firebase.currentUser();
        this.props.firebase.updateAvatar(this.state.avatarURL);
        this.props.firebase.updateAvatarDb(user.uid, this.state.avatarURL)
    }
    
    handleUploadSuccess = filename => {

        const profileData = {
            displayName: 'Time to Hack',
            photoURL: null
          }

        const img = this.props.firebase.fileRef(filename);
        img.getDownloadURL()
            .then(url =>  this.setState({ avatarURL: url }));
        
      };

    render() {

        return(
            <form className = "ui form" onSubmit = {this.onSubmit}>
                <Segment stacked>
          <FileUploader
            accept="image/*"
            name="avatar"
            storageRef={this.props.firebase.storageRef}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
          />
                </Segment>
            </form>
        )
    }


}

const AccountPage = () => {
    return (
        <AuthUserContext.Consumer>
        {authUser => (
                <Grid textAlign = "center" verticalAlign = "middle" style = {{marginTop: 50}}>
                    <Grid.Column style = {{maxWidth: 420}}>
                    <ChangeAvatar/>
                    <Header as = "h2" color = "grey" textAlign = "center">
                        Account Info
                    </Header>
                    <Card centered>
                        <Image src={authUser.photoURL} wrapped ui={false} />
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
                            <Icon name='user' />
                                0 Friends
                        </Card.Content>
                        <Card.Content extra>
                        </Card.Content>
                    </Card>

                    <Header as = "h2" color = "grey" textAlign = "center">
                        Change Your Password
                    </Header>
                    <PasswordChangeForm/>
                        
                    </Grid.Column>
                </Grid>
        )}
        </AuthUserContext.Consumer>
    );
};




const ChangeAvatar = withRouter(withFirebase(ChangeAvatarBase));

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage, ChangeAvatar);