import React from 'react';
import {Popup, Icon, Button} from 'semantic-ui-react';
import { withFirebase } from '../Firebase';
import 'firebase/storage';
import app from 'firebase/app';
import {withRouter} from 'react-router-dom';
import Avatar from '../Avatar';
import './UpdateAvatar.css';
import AvatarEdit from 'react-avatar-edit';

// a form
class UpdateAvatarBase extends React.Component {
    constructor(props){
        super(props);
        this.storage = app.storage();
        this.state = {
            uid: this.props.uid,
            photoUrl: this.props.photoUrl,
            avatarName: "",
            avatarURL: "",
            file: "",
            uploadComplete: false,
            preview: null,
            isOpen: false
        }
        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
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


    editComplete = event => {
        
        const user = this.props.firebase.currentUser();
        const avatarName = "avatar-" + user.uid + "-" + Date.now();
        console.log(this.state.preview);

        let storageRef = this.props.firebase.storage.ref(`avatar/${user.uid}`).child(`${avatarName}`);
       
        fetch(this.state.preview)
            .then(res => res.blob())
            // first store cropped image into firebase storage
            .then(blob =>
                storageRef.put(blob).then(function(snapshot) {
                    console.log(snapshot)
                    console.log('Uploaded a blob!');
                })
            )
            // then get db to correctly upload avatar with new blob
            .then(() => {

                storageRef.getDownloadURL()
                .then(url =>  this.setState({ avatarURL: url }))
                .then(() => this.props.firebase.updateAvatarDb(user.uid, this.state.avatarURL));
            });
        this.setState({ isOpen: false });
    };

    onClose() {
        this.setState({preview: null});
        this.setState({ isOpen: false });
       // this.props.firebase.updateAvatarDb(this.state.uid, this.state.preview);
    }
    
    onCrop(preview) {
        this.setState({preview, avatarURL: this.state.preview});
    }

    toggleOpen = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
          }));
      }
    

    render() {
        const {uid, preview, error} = this.state;
        
        return(
            <div>
                
                <label>
                    <div className="field">
                        <div className="upload">
                            <div className = "upload-content">
                            <Popup
                                trigger={ 
                                    <Button circular icon>
                                        <Icon name='camera' />
                                    </Button>}
                                content={
                                    <div className = "avatar-content">
                                        <AvatarEdit
                                                className = "avatar-content-item"
                                                width={350}
                                                height={350}
                                                onCrop={this.onCrop}
                                                onClose={this.editComplete}
                                                />
                                        <Button onClick = {this.editComplete}  className = "avatar-content-item">
                                            Done
                                        </Button>
                                        <Button onClick = {this.onClose}  className = "avatar-content-item">
                                            Cancel
                                        </Button>
                                    </div>
                                }
                                open={this.state.isOpen}
                                position='top center'
                                onOpen={this.toggleOpen}
                            />
                            </div>
                        </div>
                        <Avatar className = "avatar" uid = {this.state.uid} photoUrl = {this.state.avatarURL}/>
                    </div>
                    <input style = {{display:"none"}} type="file" onChange = {this.uploadImage} accept="image/png, image/jpeg"></input>
                </label>

                
                
                
                <p style={{color: '#4183c4'}}>{this.state.uploadComplete? "Success!" : null}</p>
                {error && <p>{error.message}</p>} 
            </div>
        )
        
    }


}

const UpdateAvatar = withRouter(withFirebase(UpdateAvatarBase));

export default withFirebase(UpdateAvatar);