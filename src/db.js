import firebase from 'firebase/app'
import 'firebase/database'

  const firebaseConfig = {
    apiKey: "AIzaSyA435zf84atKsj2GcDAzsTkDgnNaHm6b7k",
    authDomain: "code-names-34bd5.firebaseapp.com",
    databaseURL: "https://code-names-34bd5-default-rtdb.firebaseio.com",
    projectId: "code-names-34bd5",
    storageBucket: "code-names-34bd5.appspot.com",
    messagingSenderId: "467282472434",
    appId: "1:467282472434:web:cec4174924244418a28f6b"
  };

  export const db = firebase.initializeApp(firebaseConfig).database();
