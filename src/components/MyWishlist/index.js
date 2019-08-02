import React from 'react';
import { withAuthorization } from '../Session';

class WishlistPage extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                My wishlist
            </div>
        );
    }
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WishlistPage);
