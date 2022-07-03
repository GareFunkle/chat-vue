import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";




const config = {
    apiKey: "AIzaSyAVFq_XwlzxehN6l8BhbXXmmvd_XV0BZvI",
    authDomain: "chat-app-vuejs-cfc0b.firebaseapp.com",
    databaseURL: "https://chat-app-vuejs-cfc0b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chat-app-vuejs-cfc0b",
    storageBucket: "chat-app-vuejs-cfc0b.appspot.com",
    messagingSenderId: "390410365884",
    appId: "1:390410365884:web:d040a5a10fca7633cd59b9"  
}

const app = initializeApp(config);

const db = getDatabase(app);
export default db;
