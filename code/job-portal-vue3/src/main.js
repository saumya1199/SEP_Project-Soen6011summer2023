import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import { onUnmounted } from "vue";
import './background.css';




const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  //  measurementId: "G-NMC97HCK9Q"
  };
  
const fireapp = initializeApp(firebaseConfig);
const db = getFirestore(fireapp);
const app = createApp(App)
const auth = getAuth(fireapp);
const storage = getStorage(fireapp);
app.use(router)
app.mount('#app')

export{
    db, auth
}

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

