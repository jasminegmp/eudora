import app from 'firebase/app';

const config = require('../../config').default;

var firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.API_ID,
};

class Firebase{
    constructor(){
        app.initializeApp(firebaseConfig);
    }
}

export default Firebase;