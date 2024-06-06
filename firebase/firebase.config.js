import { initializeApp } from "firebase/app";
import { getAuth , initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCshdhqf-qjNzsH8ZSSR100P3YLUQ7CV6w",
  authDomain: "mechguideproject.firebaseapp.com",
  projectId: "mechguideproject",
  storageBucket: "mechguideproject.appspot.com",
  messagingSenderId: "995506409505",
  appId: "1:995506409505:web:df31e3e7b3b62507075360"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
 const db=getFirestore(app)
 const storage = getStorage(app);

//  if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }

export {auth,db,storage}