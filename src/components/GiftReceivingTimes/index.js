import React from 'react';
import { withFirebase } from '../Firebase';
import {Segment} from 'semantic-ui-react';
import GetBirthdayForm from '../GetBirthday';
import AddHolidayForm from '../AddHolidayForm';
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
              { value: 'Birthday', label: 'Birthday', id: 'birthday', date: "2020-01-01T07:00:00.000Z", celebrated: false},
              { value: 'Valentine\'s day', label: 'Valentine\'s day',id: 'valentines', date: "2020-02-14T07:00:00Z", celebrated: false },
              { value: 'Chinese New Year', label: 'Chinese New Year',id: 'chinesenewyear', date: "", celebrated: false },
              { value: 'Easter', label: 'Easter',id: 'easter', date: "", celebrated: false },
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
      this.isUnmounted = true;
    }

    
    handleChange = value => {
      var createFlag = false;
      console.log(value);

      // not the last item in celebrated list
      if (value !== null){

        // holidays list in db already exists
        //if (this.state.selected !== []){
          let difference = this.state.selected.filter(x => !value.includes(x)); // calculates diff
          //console.log("selected",this.state.selected);
          this.setState({ selected: value });
          //console.log("difference",difference);
          
          // add difference to database
            if (difference.length === 0)
            {
              // for each selected option
              value.map(option =>{
                //console.log("option.id",option.holidayId)

                // retrieve holiday list
                this.props.firebase.getHolidays(this.state.uid).once('value', snapshot => {
                  if (this.isUnmounted) {
                    return;
                  }
                  const holidaysObject = snapshot.val();
                  //console.log(holidaysObject);

                  // if holidays already exists in db
                  if (holidaysObject){
                    //console.log("holidaysObject", holidaysObject);
                    //console.log("value", value);
                    //if it does exist, move on and do nothing by returning
                    if (option.holidayId in  holidaysObject){
                      //console.log("do nothing")
                      return;
                    }
                    else{
                      // if it doesn't exist, add to firebase
                      //console.log("we need to add", option.id);
                      this.props.firebase.addHolidays(this.state.uid, option.label, option.id, option.value, option.value, option.date, true);
                      
                    }
                  }
                  // holiday doesn't exist in DB so return out the retrieve holiday list
                  else{
                    createFlag = true;
                    return;
                  }
                })
                

              })

              // Now go and create holidays in DB again
              if (createFlag){
                this.props.firebase.addHolidays(this.state.uid, value[0].label, value[0].id, value[0].value, value[0].value, value[0].date, true);
              }
            }
            // remove difference from database
            else{
              //console.log('Removed: ', difference[0].holidayId); 
              
              this.props.firebase.removeHolidays(this.state.uid, difference[0].holidayId);
              //console.log("got here")
            }
          //}

        }
        
        // it is the last item in celebrated list
        else{
          this.props.firebase.removeAllHolidays(this.state.uid);
          this.setState({selected:[]});
        }



    }

    callbackFunction = (childData) => {
      this.setState({
        options: this.state.options.concat(childData)
      })

    }

    render(){
      const {error} = this.state;
      return(

        <form className = "ui form" onSubmit = {this.onSubmit}>
        <Segment stacked>
            <GetBirthdayForm/>
            
            <h4>What do you celebrate?</h4>
            <Select
              value={this.state.selected}
              isMulti
              onChange={this.handleChange}
              options={this.state.options}
              showNewOptionAtTop={false}
            />
            <div className="ui divider"></div>
            <AddHolidayForm parentCallback = {this.callbackFunction}/>
            {error && <p>{error.message}</p>} 
        </Segment>
    </form>
      )
    }


}

export default withFirebase(GiftReceivingTimesForm);
