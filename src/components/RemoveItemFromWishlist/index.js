import React from 'react';
import {Icon} from 'semantic-ui-react';
import { withAuthorization } from '../Session';


class RemoveItemFromWishlist extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            id: this.props.id,
            error: null
        };

    }

    handleClick = (event) => {
        const {id} = this.state;

        event.preventDefault();

        const user = this.props.firebase.currentUser();
        //console.log(id);
        this.props.firebase.removeWishlistDb(user.uid, id)
            .then(() => {
                if (this.isUnmounted) {
                    return;
                }
                this.setState({
                    id: '',
                    error: null
                });
            })

            // otherwise, display error
            .catch(error => {
                this.setState({error});
            });
    }

    componentWillUnmount() {
        this.isUnmounted = true;
    }
      

    render(){
        
        return(
            <div>
                <a onClick ={this.handleClick}>		
                   		
                    <Icon name='minus' />
                    Remove item to wishlist
                </a>
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(RemoveItemFromWishlist);
