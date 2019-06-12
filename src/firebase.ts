/**
 * This file is part of nucleus-wallet.
 * Copyright (c) 2018 - present Zilliqa Research Pte. Ltd.
 *
 * nucleus-wallet is free software: you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * nucleus-wallet is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * nucleus-wallet.  If not, see <http://www.gnu.org/licenses/>.
 */

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
