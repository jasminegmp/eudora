import React from 'react';
import { withFirebase } from '../Firebase';
import {Segment, Form} from 'semantic-ui-react';
import GetBirthdayForm from '../GetBirthday';

// ISO 8601 format
/*const list = [
    { id: 'Birthday', date: "1991-07-04T07:00:00.000Z", celebrated: false},
    { id: 'Christmas', date: "2019-12-25T07:00:00Z", celebrated:false },
    { id: 'Halloween', date: "2019-10-31T07:00:00Z", celebrated: false },
  ];*/

// a form
class GiftReceivingTimesForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            uid: this.props.firebase.currentUser().uid,
            holidayList: null,
            error: null
        }
    }



    componentWillMount() {
        console.log("Here")
        
        this.props.firebase.getHolidays(this.state.uid).on('value', snapshot => {
          // convert messages list from snapshot
    
          const holidaysObject = snapshot.val();

          if (holidaysObject) {
            // convert messages list from snapshot
            const holidays = Object.keys(holidaysObject).map(key => ({
              ...holidaysObject[key],
              uid: key,
            }));
      

            this.setState({holidayList: holidays, isLoading: false});
          } else {
            this.setState({holidayList: null});
          }
        });
        console.log("There")
      }

    handleChangeCheckbox = (holiday, holidayId, celebrated, date) =>{
        console.log("Got here!", this.state.holidayList, holidayId, celebrated);

        // update holiday
        this.props.firebase
            // update password
            .addHolidays(this.props.firebase.currentUser().uid, holidayId, holiday, date, !celebrated)

            // otherwise, display error
            .catch(error => {
                this.setState({error});
            });
    }

    mountHolidays = () => {

        const {uid} = this.state;
        // update holiday
    
        this.props.firebase.addHolidays(uid, "newyears", "New Year's", "2020-01-01T07:00:00Z", false);
        this.props.firebase.addHolidays(uid, "valentines", "Valentine's Day", "2019-02-14T07:00:00Z", false);
        this.props.firebase.addHolidays(uid, "chinesenewyear", "Chinese New Year", "", false);
        this.props.firebase.addHolidays(uid, "saintpatricksday", "Saint Patrick's Day", "2019-03-17T07:00:00Z", false);
        this.props.firebase.addHolidays(uid, "easter", "Easter", "", false);
        this.props.firebase.addHolidays(uid, "cincodemayo", "Cinco De Mayo", "2019-05-05T07:00:00Z", false);
        this.props.firebase.addHolidays(uid, "memorialday", "Memorial Day", "", false);
        this.props.firebase.addHolidays(uid, "fourthofjuly", "Fourth of July", "2019-07-04T07:00:00Z", false);
        this.props.firebase.addHolidays(uid, "laborday", "Labor Day", "", false);
        this.props.firebase.addHolidays(uid, "halloween", "Halloween", "2019-10-31T07:00:00Z", false);
        this.props.firebase.addHolidays(uid, "thanksgiving", "Thanksgiving", "", false);
        this.props.firebase.addHolidays(uid, "christmas", "Christmas", "2019-12-25T07:00:00Z", false);
        this.props.firebase.addHolidays(uid, "hannukkah", "Hannukkah", "2019-12-25T07:00:00Z", false);
                        
    }

    render() {
        const {holidayList, error, isLoading} = this.state;

        return(
            <form className = "ui form" onSubmit = {this.onSubmit}>
                <Segment stacked>
                    <GetBirthdayForm/>

                    {holidayList && holidayList.length <= 1 ? this.mountHolidays() : null}
                    {!isLoading ? holidayList.map(holiday => {
                        return (
                            <Form.Checkbox
                                key = {holiday.holiday}
                                checked={holiday.celebrated}
                                onChange={() => this.handleChangeCheckbox(holiday.holiday, holiday.holidayId, holiday.celebrated, holiday.date)}
                                label = {holiday && holiday.date ? holiday.holiday + ", " + holiday.date.substring(5,10) : holiday.holiday}
                                />
                            
                        
                        )}) : null}
                    {error && <p>{error.message}</p>} 
                </Segment>
            </form>
        )
    }


}

export default withFirebase(GiftReceivingTimesForm);
