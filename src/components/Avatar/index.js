import React from 'react';
import {Image} from 'semantic-ui-react';
import { withAuthorization } from '../Session';
import {Link} from 'react-router-dom';

function Avatar(props){
	//console.log(props);
    //console.log(props.result);
    return(
        <Link to={{pathname: `/user/${props.uid}`, params: props.uid}}>
            <Image style = {{margin: "auto", width: "200px", height: "200px", objectFit: "cover"}}src={props.photoUrl} />
        </Link>
    );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Avatar);