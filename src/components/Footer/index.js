import React from 'react';
import {Link} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { withRouter} from 'react-router-dom';
import {Menu, Icon} from 'semantic-ui-react';
import { withFirebase } from '../Firebase';

var style = {
    backgroundColor: "#F8F8F8",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "5px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "30px",
    width: "100%",
    zIndex : "2"
}

const Footer = () => {
    return (
        <div style={style}>
            <Menu.Item as={Link} to={ROUTES.ABOUT}>About</Menu.Item>
        </div>
    );
};

export default withRouter(withFirebase(Footer));
