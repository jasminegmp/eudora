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
    

    componentDidUpdate(){
        const user = this.props.firebase.currentUser();
        this.props.firebase.updateAvatar(this.state.avatarURL);
        this.props.firebase.updateAvatarDb(user.uid, this.state.avatarURL)
    }

    onSubmit = event => {
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(url =>  this.setState({ avatarURL: url }));
            });
        this.setState({uploadComplete: true})

        event.preventDefault();
    };


    uploadImage  = event => {
          const user = this.props.firebase.currentUser();
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
                    <p style={{color: '#A9A9A9'}}>{this.state.uploadComplete? "Upload completed, please refresh page to see new avatar." : null}</p>
                    {error && <p>{error.message}</p>} 
                </Segment>
            </form>
        )
    }


}

const UpdateAvatar = withRouter(withFirebase(UpdateAvatarBase));

export default withFirebase(UpdateAvatar);