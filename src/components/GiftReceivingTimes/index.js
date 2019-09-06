import React from 'react';
import { withFirebase } from '../Firebase';
import {Segment, Form} from 'semantic-ui-react';
import GetBirthdayForm from '../GetBirthday';
import Select from 'react-select';
import './GiftReceivingTimes.css';


// a form
class GiftReceivingTimesForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selected: [],
            isLoading: true,
            uid: this.props.firebase.currentUser().uid,
            error: null,
            options: [
              { value: 'Birthday', label: 'Birthday', id: 'birthday', date: "1991-07-04T07:00:00.000Z", celebrated: false},
              { value: 'New Year\'s', label: 'New Year\'s',id: 'newyears', date: "2020-01-01T07:00:00Z", celebrated: false },
              { value: 'Valentine\'s day', label: 'Valentine\'s day',id: 'valentines', date: "2020-02-14T07:00:00Z", celebrated: false },
              { value: 'Chinese New Year', label: 'Chinese New Year',id: 'chinesenewyear', date: "", celebrated: false },
              { value: 'Saint Patrick\'s Day', label: 'Saint Patrick\'s Day',id: 'saintpatricksday', date: "2020-03-17T07:00:00Z", celebrated: false },
              { value: 'Easter', label: 'Easter',id: 'easter', date: "", celebrated: false },
              { value: 'Cinco De Mayo', label: 'Cinco De Mayo',id: 'cincodemayo', date: "2020-05-05T07:00:00Z", celebrated: false },
              { value: 'Memorial Day', label: 'Memorial Day',id: 'memorialday', date: "", celebrated: false },
              { value: 'Fourth of July', label: 'Fourth of July',id: 'fourthofjuly', date: "2020-07-04T07:00:00Z", celebrated: false },
              { value: 'Halloween', label: 'Halloween',id: 'halloween', date: "2019-10-31T07:00:00Z", celebrated: false },
              { value: 'Labor Day', label: 'Labor Day',id: 'laborday', date: "", celebrated: false },
              { value: 'Thanksgiving', label: 'Thanksgiving',id: 'thanksgiving', date: "", celebrated: false },
              { value: 'Christmas', label: 'Christmas', id: 'christmas', date: "2019-12-25T07:00:00Z", celebrated:false },
              { value: 'Hannukkah', label: 'Hannukkah',id: 'hannukkah', date: "", celebrated: false },
            ]
        }
    }


    componentWillMount() {
        
        this.props.firebase.getHolidays(this.state.uid).on('value', snapshot => {
            if (this.isUnmounted) {
            return;
            }
    
          const holidaysObject = snapshot.val();

          if (holidaysObject) {
            const holidays = Object.keys(holidaysObject).map(key => ({
              ...holidaysObject[key],
              uid: key,
            }));
            
            // only show the celebrated items
            holidays.map(holiday =>{
              if (holiday.celebrated){
                this.setState({selected: holidays});
              }
              
            })   
           
          } 
        });
      }

    componentWillUnmount() {
      this.props.firebase.getHolidays().off();
      this.isUnmounted = true;
    }

    
    handleChange = value => {

      let difference = this.state.selected.filter(x => !value.includes(x)); // calculates diff
      console.log("selected",this.state.selected);
      this.setState({ selected: value });
      console.log("difference",difference);
      
      // add difference to database
      if (difference.length === 0)
      {
        // for each selected option
        value.map(option =>{
          console.log("option.id",option.holidayId)
        
          // retrieve holiday list
          this.props.firebase.getHolidays(this.state.uid).on('value', snapshot => {
            if (this.isUnmounted) {
              return;
            }
            const holidaysObject = snapshot.val();
            console.log("holidaysObject", holidaysObject);
            console.log("value", value);
            //if it does exist, move on and do nothing by returning
            if (option.holidayId in  holidaysObject){
              console.log("do nothing")
              return;
            }
            else{
              // if it doesn't exist, add to firebase
              console.log("we need to add", option.id);
              this.props.firebase.addHolidays(this.state.uid, option.label, option.id, option.value, option.value, option.date, true);
            }
          })

        })
      }

      // remove difference from database
      else{
        console.log('Removed: ', difference[0].holidayId); 
        this.props.firebase.removeHolidays(this.state.uid, difference[0].holidayId);
      }
    


    }

    render(){
      const {holidayList, error, isLoading} = this.state;
      return(

        <form className = "ui form" onSubmit = {this.onSubmit}>
        <Segment stacked>
            <GetBirthdayForm/>

            <Select
              value={this.state.selected}
              isMulti
              onChange={this.handleChange}
              options={this.state.options}
              showNewOptionAtTop={false}
            />
            {error && <p>{error.message}</p>} 
        </Segment>
    </form>
      )
    }


}

export default withFirebase(GiftReceivingTimesForm);
