import React from 'react';
import { withAuthorization } from '../Session';

const HomePage = () => {
    return (
        <div style = {{margin: 70}}>
            <h1>Welcome to Eudora!</h1>
            <p>The goal of Eudora is for users to create a wishlist of personalized gifts. </p>
            <p><em>Name Origin:</em> Eudora is a girl's name of Greek origin which means "good gift".</p>
            <p><em>Why did I build this?</em> First, because not everybody likes their gifts to be a complete surprise. So you'll never have to pretend like you love that sweater that grandma got for you. And second, because I wanted to build a practical application in order to understand React and Firebase better.</p>
            <p><em>Get in Touch:</em> If you have any feedback or even just want to say hi, please get in touch by emailing me at jasminegmp@gmail.com.</p>
            <p><em>Currently supported features:</em></p>
            <li>Search and add items from Etsy</li>
            <li>Modify your wishlist</li>
            <li>Follow/unfollow friends</li>
            <li>Gift your friends and mark the item as "purchased" so other gifters will know you've already got the gift for your friend. The friend receiving the gift will not see what items have been purchased off their wishlist so it will still be a "surprise"!</li>
        </div>
    );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
