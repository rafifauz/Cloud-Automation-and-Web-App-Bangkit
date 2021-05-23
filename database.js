var firebaseConfig = {
    apiKey: "AIzaSyDET1lBkmp5HuKb5jXgyPD2nD8qXZ5IXt4",
    authDomain: "process.env.authDomain",
    projectId: "process.env.projectId",
    storageBucket: "process.env.storageBucket",
    messagingSenderId: "process.env.messagingSenderId",
    appId: "process.env.appId"


};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
