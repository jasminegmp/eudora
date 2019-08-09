import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = require('../../config').default;

var firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    databaseURL: config.databaseURL,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  };

class Firebase{
    constructor(){
        app.initializeApp(firebaseConfig);

        this.auth = app.auth();
        this.db = app.database();
        this.storage = app.storage();
    }

    // Authentication API

    // Create user with email and password
    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

    // Setup Signin that uses Email and Password
    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

    // Sign Out
    doSignOut = () => this.auth.signOut();

    // Reset and update passsword
    doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

    // Password update
    doPasswordUpdate = (password) => this.auth.currentUser.updatePassword(password);

    // *** User API ***
    userDb = uid => this.db.ref(`users/${uid}`);
    
    users = () => this.db.ref('users');

    currentUser = () => this.auth.currentUser;



    // *** Profile API ***

    profile = uid => this.db.ref(`profiles/${uid}`);

    profiles = () => this.db.ref('profiles');

    updateAvatar = (avatar) => this.auth.currentUser.updateProfile({photoURL:avatar});

    updateAvatarDb = (uid, avatar) => this.db.ref(`profiles/${uid}`).update({photoUrl: avatar});

    fileRef = (foldername, filename, uid) => this.storage.ref(`${foldername}`).child(`${uid}/${filename}`);

    addWishlistDb = (uid, title, url, image, id, price) => this.db.ref(`profiles/${uid}/wishlist/${id}`).update({id: id, title: title, url: url, image: image, price: price});

    removeWishlistDb = (uid, id) => this.db.ref(`profiles/${uid}/wishlist/${id}`).remove();
    
    items = (uid) => this.db.ref(`profiles/${uid}/wishlist`);

    getFirstName = (uid) => this.db.ref(`profiles/${uid}/firstName`);

    getLastName = (uid) => this.db.ref(`profiles/${uid}/lastName`);


}

export default Firebase;