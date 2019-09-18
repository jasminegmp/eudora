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
            currentLanguage: null,
            error: null
        }
    }

    componentDidMount(){
        const {uid} = this.state;

        this.props.firebase.getLanguage(uid).on('value', snapshot => {

            if (this.isUnmounted) {
                return;
            }
            
            const language = snapshot.val();

            if (language){
                this.setState({currentLanguage: language.language});
            }
            else{
                this.props.firebase.setLanguage(uid, 'english')
                    .catch(error => {
                        this.setState({error});
                    });
            }
            
        });

        // Grab birthday if it exists

        this.props.firebase.getBirthdayObj(uid).on('value', snapshot => {

            if (this.isUnmounted) {
                return;
            }
            
            const birthday = snapshot.val();
            
        });

        this.props.firebase.getBirthday(uid).on('value', snapshot => {

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
        const {uid, IsoBirthday} = this.state;
        const ISOdate = date.toISOString();

        this.setState({
            IsoBirthday: ISOdate, birthday: date
        });
        // update birthday
        this.props.firebase.updateBirthday(uid, IsoBirthday, ISOdate)

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
        const {currentLanguage, birthday, error} = this.state;


        return(
            <div style={{width:"100%"}}>
                
                {currentLanguage === 'english' ? 
                    <h4>When is your birthday?</h4>:
                    <h4>생일</h4>
                } 
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

