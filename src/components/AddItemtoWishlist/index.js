import React from 'react';
import {Icon, Form, Button} from 'semantic-ui-react';
import { withAuthorization } from '../Session';


class AddItemtoWishlist extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            note: '',
            mine: this.props.mine,
            title: this.props.title,
            id: this.props.id,
            image: this.props.image,
            price: this.props.price,
            url: this.props.url,
            purchased: false,
            clicked: false,
            error: null
        };

    }

    handleClick = (event) => {
        const {title, id, image, price, url, purchased, note} = this.state;

        event.preventDefault();

        const user = this.props.firebase.currentUser();
        this.props.firebase.addWishlistDb(user.uid, title, url, image, id, price, purchased, note, "Etsy")
            .then(() => {
                this.setState({
                    note: '',
                    title: '',
                    id: '',
                    image: '',
                    price: '',
                    url: '',
                    purchased: '',
                    error: null
                });
            })
            .then(this.setState({clicked: true}))
            // otherwise, display error
            .catch(error => {
                this.setState({error});
            });
        ;


    }
    
    onChange = (event) => {
        this.setState({note: event.target.value});
    }

    render(){
        
        return(
            <div>
                { this.state.mine ?
                (
                    <div>
                        <label>Leave a note (optional)</label>
                        <Form.Input style = {{width: '100%'}}
                                    name = "note"
                                    value = {this.state.note}
                                    onChange = {this.onChange}
                                    type = "text"
                                    placeholder = "Example: Size small"
                        />		
                        <Button style = {{marginTop: "5px"}} onClick = {this.handleClick} disabled={this.state.clicked} ><Icon name='plus' />
                        Add item to wishlist</Button>
                    </div>
                    
                ):
                (
                    <div>
                        <Button style = {{marginTop: "5px"}} onClick = {this.handleClick} disabled={this.state.clicked} ><Icon name='plus' />
                        Add item to my own wishlist</Button>
                    </div>
                )
                }
                {this.state.clicked ? <div className ="ui red floating label">Added</div> : null}
                

            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AddItemtoWishlist);
