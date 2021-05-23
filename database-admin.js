var firebaseConfig = {
    apiKey: "AIzaSyDgXAHnBMIGF75Eo3IzL16VYhkcOoJ_H2g",
    authDomain: "process.env.authDomain_admin",
    projectId: "process.env.projectId_admin",
    storageBucket: "process.env.storageBucket_admin",
    messagingSenderId: "process.env.messagingSenderId_admin",
    appId: "process.env.appId_admin"


};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
