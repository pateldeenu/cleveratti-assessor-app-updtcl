import { Platform } from 'react-native';
import firebase from '@react-native-firebase/app';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyArpz88koBldteApqzSy15tyQAWO1Lx1E',
  authDomain: 'nodejs-e8f5d.firebaseapp.com',
  projectId: 'nodejs-e8',
  databaseURL: 'https://nodejs-e8f5d-default-rtdb.asia-southeast1.firebasedatabase.app/',
  storageBucket: 'nodejs-e8f5d.appspot.com',
  messagingSenderId: '1090532239132',
  appId: `1:1090532239132:web:9ffa32f61ea9e774b47cd9`,
  latency: 1000

};
const app = await firebase.initializeApp(firebaseConfig);

const firebaseDb = initializeFirestore(app, {experimentalForceLongPolling: true});

export { firebaseDb };
