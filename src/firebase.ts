import firebase from 'firebase/app';

/*
  The apiKey essentially identifies your Firebase project. It is not a security risk for someone to know it.
  https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public
*/
const config = {
  apiKey: 'AIzaSyCg7U0eB4MydAA-XCu8LiPLVYGzLy1LQLw',
  authDomain: 'ncls-wllt.firebaseapp.com',
  databaseURL: 'https://ncls-wllt.firebaseio.com',
  projectId: 'ncls-wllt',
  storageBucket: 'ncls-wllt.appspot.com',
  messagingSenderId: '177691826547'
};

firebase.initializeApp(config);
