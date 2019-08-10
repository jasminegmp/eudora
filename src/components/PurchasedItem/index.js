import React from 'react';
import {Form, Label} from 'semantic-ui-react';
import { withAuthorization } from '../Session';


class PurchasedItem extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            uid: this.props.match.params.uid,
            id: this.props.id,
            purchased: null,
            error: null
        };

    }

    componentDidMount(){
        // Grab purchase status
        console.log("asdf", this.props.match.params.uid, this.props.id)
        this.props.firebase.getPurchaseStatus(this.state.uid, this.state.id).on('value', snapshot => {
            const purchased = snapshot.val();
            this.setState({ purchased})
  
          });
    }

    onChange = (event) => {

       // console.log(this.props.match.params.uid, event.target.name, event.target.value)
        //this.setState({[event.target.name]: !event.target.value})
        this.setState( prevState => ({
            purchased: !prevState.purchased
          }));

    }
      

    render(){
        
        return(
            <div>   
                    {this.state.purchased ? <Label attached ="top" className = "blue">Purchased</Label> : null}
                    <div className="field">
                        <Form.Checkbox
                            name = "purchased"
                            onChange = {this.onChange}
                        />
                        Purchased
                    </div>
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PurchasedItem);
