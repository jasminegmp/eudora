import React from 'react';
import { withAuthorization } from '../Session';
import './About.css';
import {List} from 'semantic-ui-react';

const AboutPage = () => {
    return (
        <div style = {{margin: 70}}>
            <h1>What is Eudora?</h1>
            <p>The goal of Eudora is for users to create a wishlist of personalized gifts. </p>

            <h2><em>Eudora's story</em></h2>
            <p>Hi, my  name is Jasmine and I built this website after growing up in with a very practical family that doesn't like their gifts to be a surprise. 
                Soon, I learned that not everybody likes their gifts to be a complete surprise. 
                <em> (Many people find having to pretend to grandma that you love that sweater she got you stressful.) </em>
                I also come from a non-web background and wanted to implement a practical application in order to learn React and Firebase.
                Thus, Eudora was born. 
            </p>
            <h2><em>That's a lot of vowels</em></h2>
            <p>I spent 5 minutes Googling for a name and I ran across 
                the girl's name Eudora which is of Greek origin and means "good gift" (exactly what I was looking for!)<br/>
                So how do you pronounce "Eudora"? It's like You-Door-Ah. Here's a Youtube video that should help you if my terrible explanation didn't make sense.</p>
            <div align = "center" className = "wrapper" >
                <iframe align = "center" src="https://www.youtube.com/embed/lAqE3YnvQBM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>
            </div>
            <h2><em>Get In Touch</em></h2>
            <p>If you have any feedback, questions, or even just want to say hi, please get in touch by emailing me at <a href='mailto:jasminegmp@gmail.com'>jasminegmp@gmail.com</a>.</p>
            <h2><em>Currently supported features:</em></h2>
            <li>Search and add items from Etsy</li>
            <li>Modify your wishlist</li>
            <li>Follow/unfollow friends</li>
            <li>Gift your friends and mark the item as "purchased" so other gifters will know you've already got the gift for your friend. The friend receiving the gift will not see what items have been purchased off their wishlist so it will still be a "surprise"!</li>
            <h2><em>Future features</em></h2>
            <p>Since this is a solo effort, (I'm the designer, developer, and tester), please be patient as I add new features! A few upcoming ones I forsee are:</p>
            <li>Ability to add items outside of Etsy</li>
            <li>Group gift exchanges like White Elephant</li>
            <li>Child wishlist for your children or furbabies</li>
        </div>
    );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AboutPage);
