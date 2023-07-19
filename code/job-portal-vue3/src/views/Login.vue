<template>
    <section class="section">
      <div class="container">
        <h2 class="title is-2">Sign in</h2>
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="text" placeholder="Email" v-model="email">
          </div>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" placeholder="Password" v-model="password">
          </div>
        </div>
        <div class="field">
          <p class="help is-danger" v-if="errMsg">{{ errMsg }}</p>
        </div>
        <div class="field">
          <button class="button is-primary" v-on:click="login">Submit</button>
        </div>
      </div>
    </section>
  </template>
  
  
  <script>
  import { ref } from 'vue';
  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
  import router from '../router';
  
  export default {
    name: 'SignIn',
    setup() {
      const email = ref("");
      const password = ref("");
      const errMsg = ref("");
  
      const login = () => {
        signInWithEmailAndPassword(getAuth(), email.value, password.value)
          .then((data) =>{
            console.log("Successfully signed in!");
            
            router.push('/')
          })
          .catch((error) => {
            console.log(error.code);
            switch (error.code){
                case "auth/invalid-email":
                errMsg.value = "Invalid email";
                break;
  
                case "auth/user-not-found":
                errMsg.value = "No account with that email was found";
                break;
  
                case "auth/wrong-password":
                errMsg.value = "Incorrect password";
                break;
                default:
                errMsg.value = "Email or password was incorrect";
                break  
            }
          });
      };  
      return { email, password, errMsg, login };
    }
  };
  </script>
  