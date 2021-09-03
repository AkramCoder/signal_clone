import * as firebase from "firebase"
import "firebase/firestore"
import "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyBvBS0kibR0rvlB96tA_Ohmw93IG2B68FY",
    authDomain: "signal-clone-8760f.firebaseapp.com",
    projectId: "signal-clone-8760f",
    storageBucket: "signal-clone-8760f.appspot.com",
    messagingSenderId: "873063645995",
    appId: "1:873063645995:web:e3a1ce4827230ebf2abb6e"
  };

let app

console.log(firebase)
if (firebase.default.apps.length === 0) {
  app = firebase.default.initializeApp(firebaseConfig)
} else {
  app = firebase.default.app()
}

const db = app.firestore()
const auth = firebase.default.auth()

export { db, auth }