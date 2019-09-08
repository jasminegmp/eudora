import React from 'react';
import { withFirebase } from '../Firebase';
import {Segment, Form, Menu, Button, Grid} from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import {withRouter} from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";

// a form
class AddHolidayFormBase extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            date: null,
            IsoDate: null,
            holidayName: '',
            isSubmitted: false,
            uid: this.props.firebase.currentUser().uid,
            error: null
        }
    }

    onChange = (date) => {
        const ISOdate = date.toISOString();
        console.log(date, ISOdate);
        this.setState({
            IsoDate: ISOdate, date: date
        });
        this.setState({isSubmitted: false});  
    }
    
    onTextChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
        this.setState({isSubmitted: false});  
    }

    onSubmit =  async (event) => {

        const {IsoDate, holidayName, uid} = this.state;
        var id = holidayName.replace(/[^a-zA-Z]/g, "");
        id = id.toLowerCase();

        const newHoliday = {celebrated: true, date: IsoDate, label: holidayName, value: holidayName, id};
        event.preventDefault();

        this.props.parentCallback(newHoliday);
    
        this.setState({isSubmitted: true});

        this.props.firebase.addHolidays(uid, newHoliday.label, newHoliday.id, newHoliday.value, newHoliday.value, newHoliday.date, true)
            .then(() => {
                this.setState({
                    date: null,
                    IsoDate: null,
                    holidayName : '',
                    isSubmitted: true,
                    error: null
                });
            })
            .catch(error => {
                this.setState({error});
            });

    }

    componentWillUnmount() {
        this.props.firebase.getBirthday().off();
        this.isUnmounted = true;
    }

    render() {
        const {isSubmitted, date, holidayName, error} = this.state;
        const isInvalid = 
        date === null && holidayName === '';

        return(
            <div style={{width:"100%"}}>
                <h4>Don't see a holiday?</h4>
                <Grid.Column width={16}>
                    <DatePicker
                    dateFormat="yyyy/MM/dd"
                            onChange={this.onChange}
                            selected = {date}
                            placeholderText = "2020/12/25"
                            style = {{marginTop: 10}}
                        />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Form.Input
                        name = "holidayName"
                        value = {holidayName}
                        onChange = {this.onTextChange}
                        type = "text"
                        placeholder = "Christmas"
                        style = {{marginTop: 10, width: "177px"}}
                    />
                </Grid.Column>
                <button className = "ui button " disabled = {isInvalid} onClick = {this.onSubmit} disabled = {isInvalid || isSubmitted === true} style = {{marginTop: 10}}>Add Holiday to List</button>
                {error && <p>{error.message}</p>} 
            </div>
 
        )
    }


}

const AddHolidayForm = withRouter(withFirebase(AddHolidayFormBase));

export default withFirebase(AddHolidayForm);

