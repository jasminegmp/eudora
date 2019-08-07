import React from 'react';
import {Icon} from 'semantic-ui-react';
import { withAuthorization } from '../Session';


class AddItemtoWishlist extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            title: this.props.title,
            id: this.props.id,
            image: this.props.image,
            price: this.props.price,
            url: this.props.url,
            clicked: false,
            error: null
        };

    }

    handleClick = (event) => {
        const {title, id, image, price, url} = this.state;

        event.preventDefault();

        const user = this.props.firebase.currentUser();
        this.props.firebase.addWishlistDb(user.uid, title, url, image, id, price)
            .then(() => {
                this.setState({
                    title: '',
                    id: '',
                    image: '',
                    price: '',
                    url: '',
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
      

    render(){
        
        return(
            <div>
                 
                <a className = "item" onClick ={this.handleClick}>						
                    <Icon name='plus' />
                    Add item to wishlist
                    {this.state.clicked ? <div className ="ui red floating label">Added</div> : null}
                </a>
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AddItemtoWishlist);
