import React from 'react';
import { withFirebase } from '../Firebase';
import {Segment, Form} from 'semantic-ui-react';

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
      }

    handleChangeCheckbox = (id, celebrated, date) =>{
        console.log("Got here!", this.state.holidayList, id, celebrated);

        // update holiday
        this.props.firebase
            // update password
            .addHolidays(this.props.firebase.currentUser().uid, id, date, !celebrated)

            // otherwise, display error
            .catch(error => {
                this.setState({error});
            });
    }

    render() {
        const {holidayList, error, isLoading} = this.state;


        return(
            <form className = "ui form" onSubmit = {this.onSubmit}>
                <Segment stacked>
                    <div className="field">
                    </div>
                    {!isLoading ? holidayList.map(holiday => {
                        return (
                            <Form.Checkbox
                                key = {holiday.holiday}
                                checked={holiday.celebrated}
                                onChange={() => this.handleChangeCheckbox(holiday.holiday, holiday.celebrated, holiday.date)}
                                label = {holiday.holiday}
                                />
                        
                        )}) : null}
                    {error && <p>{error.message}</p>} 
                </Segment>
            </form>
        )
    }


}

export default withFirebase(GiftReceivingTimesForm);
