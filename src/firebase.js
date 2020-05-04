import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBHGyhWu241c44zWc72hDrp8ZJuU3djt6g",
  authDomain: "u-2-write.firebaseapp.com",
  databaseURL: "https://u-2-write.firebaseio.com",
  projectId: "u-2-write",
  storageBucket: "u-2-write.appspot.com",
  messagingSenderId: "541732055845",
  appId: "1:541732055845:web:c2c0dbbf598c65c1be08cc",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
