import React from 'react';
import {Button, Form} from 'semantic-ui-react';
import { withAuthorization } from '../Session';


class UpdateNoteInWishlist extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            note: '',
            id: this.props.id,
            uid: this.props.firebase.currentUser().uid,
            error: null
          };

    }

    componentDidMount(){
        // Grab note
        this.props.firebase.getWishlistNote(this.state.uid, this.state.id).on('value', snapshot => {
            if (this.isUnmounted) {
                return;
            }
            const note = snapshot.val();
            this.setState({ note})
            });
        this.setState({note: ''});
    }

    onClick = (event) => {

        this.props.firebase.updateWishlistNote(this.state.uid, this.state.id, this.state.note)
            // otherwise, display error
            .catch(error => {
                this.setState({error});
            });
    }

    onChange = (event) => {
        this.setState({note: event.target.value});
    }

    render(){
        
        return(
            <div>
                
                <Form.Input style = {{width: '100%'}}
                            name = "note"
                            value = {this.state.note}
                            onChange = {this.onChange}
                            type = "text"
                            placeholder = "Update note here"
                />
                <Button onClick = {this.onClick} style = {{marginTop: "5px"}} >Update note</Button>

            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(UpdateNoteInWishlist);
