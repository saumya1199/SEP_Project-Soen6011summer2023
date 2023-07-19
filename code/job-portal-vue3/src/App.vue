<template>
    <header>
      <nav class="navbar custom-navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <h1 class="title">Quick Jobs</h1>
          </a>
        </div>
  
        <div class="navbar-menu">
          <div class="navbar-start">
            <router-link to="/" class="navbar-item">Home</router-link>
            <router-link to="/about" class="navbar-item">About</router-link>
            <router-link v-if="isCandidate" to="/jobs" class="navbar-item">Browse Jobs</router-link>
            <router-link v-if="isLoggedOut" to="/register" class="navbar-item">Register</router-link>
            <router-link v-if="isEmployer" to="/addjob" class="navbar-item">Post Jobs</router-link>
            <router-link v-if="isCandidate" to="/applications" class="navbar-item">View Applications</router-link>
            <router-link v-if="isEmployer" to="/editEmployer" class="navbar-item">Edit Employer</router-link>
            <router-link v-if="isEmployer" to="/applicationsEmployer" class="navbar-item">View Applications</router-link>
            <router-link v-if="isCandidate" to="/editCandidate" class="navbar-item">Edit Candidate</router-link>
          </div>
  
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <button v-on:click="handleSignOut" v-if="isLoggedOut" class="button is-light">Sign in</button>
                <button v-on:click="handleSignOut" v-if="!isLoggedOut" class="button is-light">Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  
    <section class="section">
      <div class="container">
        <router-view />
        
      </div>
    </section>
  </template>
  
  <script>
  import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
  import { db } from "@/main"
  import { getCountFromServer, query,where,documentId , collection, doc, getDoc} from 'firebase/firestore'
  
  export default {
    data() {
      return {
        isLoggedOut: false,
        isCandidate: false,
        isEmployer: false
      };
    },
    mounted() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          this.isLoggedOut = true;
        } else {
          this.isLoggedOut = false;
          if( await(await getCountFromServer(query(collection(db, "employer_profiles"),where(documentId(),'==',user.email)))).data().count==1){
            this.isEmployer = true;
          }
          else{
            this.isEmployer = false;
          }
          if( await(await getCountFromServer(query(collection(db, "candidate_profiles"),where(documentId(),'==',user.email)))).data().count==1){
            this.isCandidate = true;
          }
          else{
            this.isCandidate = false;
          }
          
        }
      });
  
    },
    methods: {
      handleSignOut() {
        const auth = getAuth();
        signOut(auth).then(() => {
          this.isCandidate = false;
          this.isEmployer = false;
          this.$router.push("/login");
        });
      },
    },
  };
  </script>
  
  <style>
  
  /* @import 'bulma\css\bulma.min.css'; */
  @import 'bulma/css/bulma.min.css';

  .custom-navbar {
  background-color: #B7CC4F ;
  /* Add any additional styles for the navbar here */
}

  </style>
  