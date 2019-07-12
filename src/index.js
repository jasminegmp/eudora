import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';

import App from './components/App/index';
import Firebase, { FirebaseContext } from './components/Firebase';

ReactDOM.render(
    <FirebaseContext.Provider value = {new Firebase()}>
        <App />
    </FirebaseContext.Provider>,
    document.getElementById('root')
);

if (module.hot){
    module.hot.accept();
}