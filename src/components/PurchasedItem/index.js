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
        this.props.firebase.getPurchaseStatus(this.state.uid, this.state.id).on('value', snapshot => {
            const purchased = snapshot.val();
            this.setState({ purchased})
  
          });
    }

    onChange = (event) => {

       // console.log(this.props.match.params.uid, event.target.name, event.target.value)
        //this.setState({[event.target.name]: !event.target.value})
        

        // update purchase status
        this.props.firebase.updatePurchaseStatus(this.state.uid, this.state.id, !this.state.purchased)
            .then(this.setState({purchased: !this.state.purchased}))
            .catch(error => {
                this.setState({error});
            });
    
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
