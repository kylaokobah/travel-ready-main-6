import db, { auth } from '..';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
import { collection, doc, addDoc, getDoc } from 'firebase/firestore';
import { UserData, AuthContextType } from "types";

const COLLECTION_NAME = "users";

export const signIn = () => {
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider);
}

export const onAuthChange = (callback: any) => {

    return onAuthStateChanged(auth, (user) => {
        callback(user);
    })
}

export const signOutUser = () => {
    return signOut(auth);
}

export const login = async (email: string, password: string) => {
               try {
                 const response = await signInWithEmailAndPassword(auth, email, password);
                 return response;
               } catch (err) {
                 console.error(err);
               }
             };

export const register = async (displayName: string, email: string, photoURL: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const initialUser: UserData = {
      uid: user.uid,
      displayName,
      email,
          photoURL,
          Budget: 0,
          countries_visited: [],
          places_visited: [],
          tags: [],
          travel_histories: [],
          countries_plan:[],
          places_plan: [],
    };
    const docRef = await addDoc(collection(db, "users"), initialUser);
        if (docRef) return initialUser;
        else throw new Error();
      } catch (err) {
       alert("Account Already exists");
        console.error(err);
        return null as UserData;
      }
    };

    