import React from 'react';
import { withAuthorization } from '../Session';

const HomePage = () => {
    return (
        <div style = {{margin: 70}}>
            <h1>Welcome to Eudora!</h1>
            <p>Name Origin: Eudora is a girl's name of Greek origin which means "good gift".</p>
            <p>The goal of Eudora is for users to create a wishlist of personalized gifts. </p>
            <p></p>
            <p>Features coming in the future: Add items outside of Etsy, Group Gifting Exchanges like White Elephant, Child Wishlist for Your Children, and more!</p>
        </div>
    );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
