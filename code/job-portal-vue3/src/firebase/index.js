// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
// import { onUnmounted } from "vue";


// const firebaseConfig = {
//     apiKey: "AIzaSyBS8rQ0ZIdgt6SY5eOIoIEGm7r5Ufc3Z-Q",
//     authDomain: "vue3-firebase-auth-4b952.firebaseapp.com",
//     projectId: "vue3-firebase-auth-4b952",
//     storageBucket: "vue3-firebase-auth-4b952.appspot.com",
//     messagingSenderId: "27985959314",
//     appId: "1:27985959314:web:4f9ff4730cbe1c4c8d894b"
// };


// const firebaseApp = firebase.initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);
// const auth = getAuth(firebaseApp);


// export const createUser = user => {
//     return usersCollection.add(user)
// }

// export const getUser = async id => {
//     const user = await usersCollection.doc(id).get()
//     return user.exists ? user.data() : null
// }

// export const updateUser = (id, user) => {
//     return usersCollection.doc(id).update(user)
// }

// export const deleteUser = id => {
//     return usersCollection.doc(id).delete
// }

// export const userLoadUsers = () => {
// const users = ref([])
// const close = usersCollection.onSnapshot(snapshot =>{
// users.value = snapshot.docs.map(doc =>({ id: doc.id, ...doc.data()}))
// })
// onUnmounted(close)
//     return users
// }

// export{
//     db, auth
// }