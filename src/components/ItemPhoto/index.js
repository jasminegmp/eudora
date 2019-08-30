import React from 'react';
import {Image} from 'semantic-ui-react';
import { withAuthorization } from '../Session';

function ItemPhoto(props){
	//console.log(props);
    //console.log(props.result);
    return(
        <a href = {props.url} target="_blank"  rel="noopener noreferrer">
            <Image style = {{margin: "auto", width: "200px", height: "200px", objectFit: "cover"}} src={props.photoUrl} />
        </a>
    );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ItemPhoto);