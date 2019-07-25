import React from 'react';
import { withAuthorization } from '../Session';
import {Image} from 'semantic-ui-react';

const WishlistPage = () => {
    return (
        <div>
            <h1>My Wishlist</h1>
            <Image src={"https://www.amazon.com/gp/product/B000NVBVIQ/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1"} wrapped ui={false} />
        </div>
    );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WishlistPage);
