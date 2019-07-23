import React from 'react';
import {Segment} from 'semantic-ui-react';
import { withFirebase } from '../Firebase';
import 'firebase/storage';
import app from 'firebase/app';
import {withRouter} from 'react-router-dom';

// a form
class UpdateAvatarBase extends React.Component {
    constructor(props){
        super(props);
        this.storage = app.storage();
        this.state = {
            avatarName: "",
            avatarURL: ""
        }
    }
    

    componentDidUpdate(){
        const user = this.props.firebase.currentUser();
        this.props.firebase.updateAvatar(this.state.avatarURL);
        this.props.firebase.updateAvatarDb(user.uid, this.state.avatarURL)
    }

    onSubmit = event => {

      };

    uploadImage  = event => {
          const user = this.props.firebase.currentUser();
          const avatarName = "avatar-" + user.uid + "-" + Date.now();
          this.props.firebase.storage.ref(`avatar/${user.uid}`).child(`${avatarName}`).put(event.target.files[0])
          .then(() => {
            const img = this.props.firebase.fileRef('avatar', this.state.avatarName, user.uid);
            img.getDownloadURL()
                .then(url =>  this.setState({ avatarURL: url }));
          })
          this.setState({avatarName: avatarName});
        }

    render() {
        const {avatarURL, error} = this.state;

        return(
            <form className = "ui form" onSubmit = {this.onSubmit}>
                <Segment stacked>
                    <input type="file" onChange = {this.uploadImage} accept="image/png, image/jpeg"></input>
                    <button className = "ui button " type = "submit" >Change My Avatar</button>
                    {error && <p>{error.message}</p>} 
                </Segment>
            </form>
        )
    }


}

const UpdateAvatar = withRouter(withFirebase(UpdateAvatarBase));

export default withFirebase(UpdateAvatar);