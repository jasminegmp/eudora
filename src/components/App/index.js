import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import NavBar from '../NavBar';
import SignUpPage from '../SignUp';

import * as ROUTES from '../../constants/routes';

const App = () => {
    return(
        <Router>
            <NavBar/>
            <SignUpPage/>
        </Router>
    )
};
export default App;

