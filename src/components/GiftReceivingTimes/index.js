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
            celebrated: null,
            uid: this.props.firebase.currentUser().uid,
            holidayList: null,
            error: null
        }
    }

    componentDidMount() {
        
        this.props.firebase.getHolidays(this.state.uid).on('value', snapshot => {
          // convert messages list from snapshot
    
          const holidaysObject = snapshot.val();

          if (holidaysObject) {
            // convert messages list from snapshot
            const holidays = Object.keys(holidaysObject).map(key => ({
              ...holidaysObject[key],
              uid: key,
            }));
      

            this.setState({holidayList: holidays});
          } else {
            this.setState({holidayList: null});
          }
        });
      }


    onSubmit = (event) => {
        const {birthday} = this.state;

        event.preventDefault();
        

        // update holiday
        this.props.firebase
            // update password
            .addHolidays(this.props.firebase.currentUser().uid, birthday)

            // if successful, reinitialize state back to blanks
            .then(authUser =>{
                this.setState({
                    password: '',
                    passwordConfirm: '',
                    error: null
                });
            })

            // otherwise, display error
            .catch(error => {
                this.setState({error});
            });


//            addHolidays = (uid, birthday) => this.db.ref(`profiles/${uid}/wishlist/${id}`).update({birthday});

          //  removeHolidays = (uid, targetHoliday) => this.db.ref(`profiles/${uid}/wishlist/${id}/${targetHoliday}`).remove();
    }

    handleChangeCheckbox = (id, celebrated) =>{
        console.log("Got here!");

        //update state list with updated checkbox
        let holidayList = [...this.state.holidayList];  
        let index = holidayList.findIndex(el => id == el.id);
        holidayList[index].celebrated = !celebrated;                  
        this.setState({ holidayList });        
    }

    
    render() {
        const {holidayList, error} = this.state;


        return(
            <form className = "ui form" onSubmit = {this.onSubmit}>
                <Segment stacked>
                    <div className="field">

                    </div>
                    <button className = "ui button " type = "submit" >Submit</button>

                    {error && <p>{error.message}</p>} 
                </Segment>
            </form>
        )
    }


}


export default withFirebase(GiftReceivingTimesForm);

/* <Form.Checkbox
                                checked={holiday.celebrated}
                                onChange={() => this.handleChangeCheckbox(holiday.id, holiday.celebrated)}
                                label = {holiday.id}
                                value = {holiday.celebrated}
                                /> */