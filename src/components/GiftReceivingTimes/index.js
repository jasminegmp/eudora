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
            isLoading: true,
            uid: this.props.firebase.currentUser().uid,
            holidayList: null,
            holidayArray: null,
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


        //update 


/*
        //update state list with updated checkbox
        let holidayList = [...this.state.holidayList];  
        let index = holidayList.findIndex(el => id == el.id);
        console.log(holidayList, index)
        holidayList[index].celebrated = !celebrated;                  
        this.setState({ holidayList });     */   
    }

   
  
   checkboxes = () => {
    const listItems = this.state.holidayList.map((d) => <li key={d[0].id}>{d[0].name}</li>);

    return listItems;

   }

    render() {
        const {holidayList, error, isLoading} = this.state;
        console.log("reading:", this.state.holidayList)


        return(
            <form className = "ui form" onSubmit = {this.onSubmit}>
                <Segment stacked>
                    <div className="field">
                    </div>
                    {!isLoading ? this.state.holidayList.map(d => {
                        return (
                            <Form.Checkbox
                                checked={d.celebrated}
                                onChange={() => this.handleChangeCheckbox(d.holiday, d.celebrated, d.date)}
                                label = {d.holiday}
                                value = {d.celebrated}
                                />
                        
                        )}) : null}
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

                                /**                    
       })} */