import React from 'react';
import { withFirebase } from '../Firebase';
import DatePicker from "react-datepicker";
import {withRouter} from 'react-router-dom';
import './GetBirthday.css'
import "react-datepicker/dist/react-datepicker.css";

// a form
class GetBirthdayFormBase extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            birthday: null,
            IsoBirthday: null,
            uploadComplete: false,
            uid: this.props.firebase.currentUser().uid,
            error: null
        }
    }

    componentDidMount(){
        // Grab birthday if it exists

        this.props.firebase.getBirthdayObj(this.state.uid).on('value', snapshot => {

            if (this.isUnmounted) {
                return;
            }
            
            const birthday = snapshot.val();
            
        });

        this.props.firebase.getBirthday(this.state.uid).on('value', snapshot => {

            if (this.isUnmounted) {
                return;
            }
            
            const birthday = snapshot.val();

            if (birthday){
                const date = new Date(birthday);
                this.setState({IsoBirthday: birthday, birthday: date});
            }
            
        });
  
    }

    onChange = (date) => {
        const ISOdate = date.toISOString();
        console.log(date, ISOdate);
        this.setState({
            IsoBirthday: ISOdate, birthday: date
        });
        // update birthday
        this.props.firebase.updateBirthday(this.state.uid, this.state.IsoBirthday, ISOdate)

        // otherwise, display error
        .catch(error => {
            this.setState({error});
        });
        //console.log(this.state.newBirthday)
    }


    componentWillUnmount() {
        this.props.firebase.getBirthday().off();
        this.isUnmounted = true;
      }

    render() {
        const {IsoBirthday, birthday, error} = this.state;


        return(
            <div style={{width:"100%"}}>
                <h4>When is your birthday?</h4>
                <DatePicker
                dateFormat="yyyy/MM/dd"
                        onChange={this.onChange}
                        selected = {birthday}
                    /><br/>
                {error && <p>{error.message}</p>} 
                <div className="ui divider"></div>
               
            </div>
 
        )
    }


}

const GetBirthdayForm = withRouter(withFirebase(GetBirthdayFormBase));

export default withFirebase(GetBirthdayForm);

