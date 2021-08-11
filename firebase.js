import firebase from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyC_feNv0nBdvmzYif36Q4XzN0GkZuT4-8E",
    authDomain: "uploaddownload-c5915.firebaseapp.com",
    projectId: "uploaddownload-c5915",
    storageBucket: "uploaddownload-c5915.appspot.com",
    messagingSenderId: "758573497282",
    appId: "1:758573497282:web:4419a72bf298b015b1745b",
    measurementId: "G-RN490B7XF5"
};

if(!firebase.apps.length){

firebase.initializeApp(firebaseConfig)
console.log("Firebase  ok ");

 }

 const db = firebase.firestore();
export default () => {

    return { firebase, storage,db, auth, database };
}
