import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
     apiKey: "AIzaSyAzsytyeW8QvFm56ygSuEqRNvpzVZ-EFPM",
     authDomain: "travelready-39480.firebaseapp.com",
     projectId: "travelready-39480",
     storageBucket: "travelready-39480.appspot.com",
     messagingSenderId: "517626503090",
     appId: "1:517626503090:web:21650bdd70cb3174c44eab",
     measurementId: "G-9Z1X79PPPP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage();


export default db;