import React from 'react';
import {Checkbox} from 'semantic-ui-react';
import { withAuthorization } from '../Session';


class PurchasedItem extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            uid: this.props.match.params.uid,
            id: this.props.id,
            purchased: false,
            error: null
        };

    }

    componentDidMount(){
        // Grab purchase status
        this.props.firebase.getPurchaseStatus(this.state.uid, this.state.id).on('value', snapshot => {
            if (this.isUnmounted) {
                return;
              }
            const purchased = snapshot.val();
            this.setState({ purchased})
  
          });
    }

    componentWillUnmount() {
        this.props.firebase.getPurchaseStatus().off();
        this.isUnmounted = true;
      }

    onChange = (event) => {

       // console.log(this.props.match.params.uid, event.target.name, event.target.value)
        //this.setState({[event.target.name]: !event.target.value})
        
        if (this.isUnmounted) {
            return;
         }
        // update purchase status
        this.props.firebase.updatePurchaseStatus(this.state.uid, this.state.id, !this.state.purchased)
            .then(this.setState({purchased: !this.state.purchased}))
            .catch(error => {
                this.setState({error});
            });
    
    }
      

    render(){
        
        return(
            <Checkbox
                name = "purchased"
                checked = {this.state.purchased}
                onChange = {this.onChange}
                label = "Purchased"
            />
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PurchasedItem);
