import firebase from "firebase/compat/app";
import 'firebase/compat/database';


const firebaseConfig = {
  apiKey: "AIzaSyDLxaQDs695pKV4LQqcLlFBdarCDDlvezs",
  authDomain: "agenda-49a9f.firebaseapp.com",
  projectId: "agenda-49a9f",
  storageBucket: "agenda-49a9f.appspot.com",
  messagingSenderId: "249290472114",
  appId: "1:249290472114:web:8c2abbf4967471756327ab"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}else{
    firebase.app()
}

const database = firebase.database()

export {database, firebase }