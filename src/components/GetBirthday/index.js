import React from 'react';
import { withFirebase } from '../Firebase';
import DatePicker from "react-date-picker";
import {Button} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import './GetBirthday.css'

// a form
class GetBirthdayFormBase extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            birthday: null,
            newBirthday: null,
            uploadComplete: false,
            uid: this.props.firebase.currentUser().uid,
            error: null
        }
    }

    componentDidMount(){
        // Grab birthday if it exists
        this.props.firebase.getBirthday(this.state.uid).on('value', snapshot => {

            if (this.isUnmounted) {
                return;
            }
            
            const birthday = snapshot.val();
            //console.log(birthday);
            if (birthday){
                this.setState({ birthday})
            }
            
        });
  
    }

    onChange = (date) => {
        this.setState({
            newBirthday: date
        });
        this.setState({uploadComplete: false})
        //console.log(this.state.newBirthday)
    }

    onSubmit = (event) =>{
        event.preventDefault(); 
        // update birthday
        this.props.firebase.updateBirthday(this.state.uid, this.state.newBirthday)

        // otherwise, display error
        .catch(error => {
            this.setState({error});
        });

        this.setState({uploadComplete: true})
    }

    componentWillUnmount() {
        this.props.firebase.getBirthday().off();
        this.isUnmounted = true;
      }

    render() {
        const {newBirthday, error} = this.state;


        return(
            <div style={{width:"100%"}}>
                <DatePicker
                        className = "date-picker"
                        onChange={this.onChange}
                        value = {newBirthday}
                    /><br/>
                <Button className = "birthday-button" onClick = {this.onSubmit}>Update Birthday</Button>
                <p style={{color: '#4183c4'}}>{this.state.uploadComplete? "Updated!" : null}</p>
                {error && <p>{error.message}</p>} 
                <div className="ui divider"></div>
               
            </div>
 
        )
    }


}

const GetBirthdayForm = withRouter(withFirebase(GetBirthdayFormBase));

export default withFirebase(GetBirthdayForm);

