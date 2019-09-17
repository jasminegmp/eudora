import React from 'react';
import {Image} from 'semantic-ui-react';
import { withAuthorization } from '../Session';

function Avatar(props){
    return(
            <Image style = {{border: "none", margin: "auto", width: "150px", height: "150px", objectFit: "cover"}}src={props.photoUrl} />

    );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Avatar);