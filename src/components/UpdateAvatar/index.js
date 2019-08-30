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
            avatarURL: "",
            file: "",
            uploadComplete: false
        }
    }

    componentDidMount(){
        // Grab photo url
        this.props.firebase.getPhotoUrl(this.state.uid).on('value', snapshot => {
            if (this.isUnmounted) {
                return;
            }
            const photoUrl = snapshot.val();
            this.setState({ avatarURL: photoUrl})
            });
    }

    


    onSubmit = event => {
        
        const user = this.props.firebase.currentUser();
        event.preventDefault();
        //event.preventDefault();
        var uploadTask = this.props.firebase.storage.ref(`avatar/${user.uid}`).child(`${this.state.avatarName}`).put(this.state.file);
          
          
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', (snapshot) =>{
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, (error) =>  {
            // Handle unsuccessful uploads
        }, () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL()
            .then(url =>  this.setState({ avatarURL: url }))
            .then(() => this.props.firebase.updateAvatarDb(user.uid, this.state.avatarURL));
            });
           

    


            this.setState({uploadComplete: true})

    };


    uploadImage  = event => {
        this.setState({uploadComplete: false});
        const user = this.props.firebase.currentUser();
        const avatarName = "avatar-" + user.uid + "-" + Date.now();
        this.setState({avatarName: avatarName});
        this.setState({file: event.target.files[0]})
    };
          

    render() {
        const {error} = this.state;

        return(
            <form className = "ui form" onSubmit = {this.onSubmit}>
                <Segment stacked>
                    <div className="field">
                        <input type="file" onChange = {this.uploadImage} accept="image/png, image/jpeg"></input>
                    </div>
                    <button className = "ui button " type = "submit" >Change My Avatar</button>
                    <p style={{color: '#4183c4'}}>{this.state.uploadComplete? "Success!" : null}</p>
                    {error && <p>{error.message}</p>} 
                </Segment>
            </form>
        )
    }


}

const UpdateAvatar = withRouter(withFirebase(UpdateAvatarBase));

export default withFirebase(UpdateAvatar);