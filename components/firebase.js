import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-OwFTrkVZ14yYughJAuAPKfXVbX-GOVs",
  authDomain: "test-37e9d.firebaseapp.com",
  projectId: "test-37e9d",
  storageBucket: "test-37e9d.appspot.com",
  messagingSenderId: "307865303179"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;