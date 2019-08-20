import React from 'react';
import { withFirebase } from '../Firebase';
import DatePicker from "react-date-picker";
import {withRouter} from 'react-router-dom';

// a form
class GetBirthdayFormBase extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            birthday: null,
            newBirthday: null,
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
    }

    componentWillUnmount() {
        this.props.firebase.getBirthday().off();
        this.isUnmounted = true;
      }

    render() {
        const {newBirthday, error} = this.state;


        return(
            <div>
                <DatePicker
                    
                        onChange={this.onChange}
                        value = {newBirthday}
                    />
                <button className = "ui button " style = {{marginLeft: '5px', fontSize: '.8em'}} onClick = {this.onSubmit}>Update Birthday</button>
                {error && <p>{error.message}</p>} 
            </div>
 
        )
    }


}

const GetBirthdayForm = withRouter(withFirebase(GetBirthdayFormBase));

export default withFirebase(GetBirthdayForm);

