  import * as firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/firestore";

  const firebaseConfig = {
    apiKey: "AIzaSyDMwmRE3rLf8jHYD2sHtumNVLRyi6dd9zo",
    authDomain: "relationship-goals-5dd8b.firebaseapp.com",
    databaseURL: "https://relationship-goals-5dd8b.firebaseio.com",
    projectId: "relationship-goals-5dd8b",
    storageBucket: "relationship-goals-5dd8b.appspot.com",
    messagingSenderId: "1036892315936",
    appId: "1:1036892315936:web:ab473d9848b04d6765b745",
    measurementId: "G-YNKCCEXDD5",
  };

  firebase.initializeApp(firebaseConfig);

  export const db = firebase.firestore();

  // db.collection("sample").doc("A").set({a:"b"})