<template>    
    <section class="section">
      <div class="container">
        <h1 class="title">Create an Account</h1>
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="email" placeholder="Email" v-model="email" />
          </div>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" placeholder="Password" v-model="password" />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-primary" v-on:click="registerEMP">Register as Employer</button>
            <div>

            </div>
            <button class="button is-primary" v-on:click="registerCAN " style="margin-top: 10px;">Register as Candidate</button>
          </div>
        </div>       
      </div>
    </section>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import { useRouter } from 'vue-router';
  import router from '../router';
  import { doc, setDoc,collection, addDoc, getFirestore  } from "firebase/firestore"; 
  import { db } from '@/main'
  
  
  export default {
    setup() {
      const email = ref("");
      const password = ref("");

  
      const registerEMP = async () => {
        
        createUserWithEmailAndPassword(getAuth(), email.value, password.value)
          .then( async (data) =>{
            console.log("Successfully registered");
            await setDoc(doc(db, "employer_profiles",email.value ), {
            company_name: "",
            first_name: "",
            last_name: ""
            });
            router.push('/editEmployer')
          })
          .catch((error) => {
            console.log(error.code);
            alert(error.message);
          });

      };
      const registerCAN = async () => {
        createUserWithEmailAndPassword(getAuth(), email.value, password.value)
          .then( async (data) =>{
            console.log("Successfully registered");
            await setDoc(doc(db, "candidate_profiles",email.value), {
            first_name: "",
            last_name: "",
            resume: ""
            });
            router.push('/editCandidate')
          })
          .catch((error) => {
            console.log(error.code);
            alert(error.message);
          });
      };
      
      return {
        email,
        password,
        registerEMP,
        registerCAN
      }
    }
  }
  </script>

  <style>

</style>
  