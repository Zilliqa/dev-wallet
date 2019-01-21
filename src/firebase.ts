import firebase from 'firebase/app';

/*
  The apiKey essentially identifies your Firebase project. It is not a security risk for someone to know it.
  https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public
*/
const config = {
  apiKey: 'AIzaSyBTe5IC3O5U5Z93gyKk4Gd7MVOdrfdU1Ao',
  authDomain: 'nucleus-wallet.firebaseapp.com',
  databaseURL: 'https://nucleus-wallet.firebaseio.com',
  projectId: 'nucleus-wallet',
  storageBucket: 'nucleus-wallet.appspot.com',
  messagingSenderId: '290607547429'
};

firebase.initializeApp(config);
