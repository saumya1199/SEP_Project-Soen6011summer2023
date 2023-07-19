<template>
    <section class="section">
      <div class="container">
        <h2 class="title is-2">Edit Employer Profile</h2>
        
        <div class="field">
          <label class="label">First Name</label>
          <div class="control">
            <input class="input" type="text" v-bind:placeholder="pfirstName" v-model="firstName">
          </div>
        </div>
        <div class="field">
          <label class="label">Last Name</label>
          <div class="control">
            <input class="input" type="text" v-bind:placeholder="plastName" v-model="lastName">
          </div>
        </div>
        <div class="field">
          <label class="label">Resume</label>
          <div class="control">
            <input class="input" type="textarea" v-bind:placeholder="presume" v-model="resume">
          </div>
        </div>
        
        <div class="field">
          <button class="button is-success" v-on:click="saveProfile">Save</button>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { db } from '@/main'
  import { updateDoc, collection, addDoc, getDocs, query, where, deleteDoc, doc, getDoc } from 'firebase/firestore'
  import { getAuth } from "firebase/auth";
  
  export default {
  
  name: 'EditEmployer',
  data() {
  
    return {
      firstName: '',
      lastName: '',
      resume: '',
      pfirstName: '',
      plastName: '',
      presume: '',
      auth: null
  
    }
  },
  created() {
  
    // Get the user object from the promise returned by getAuth()
    this.auth = getAuth();
    this.getProfile();
  
  },
  
  methods: {  
  
    async getProfile (){
        const docRef = doc(db, "candidate_profiles", this.auth.currentUser.email);
        const docSnap = await ( getDoc(docRef));
        //console.log(docSnap.data().company_name);
        this.presume = docSnap.data().resume;
        this.pfirstName = docSnap.data().first_name;
        this.plastName = docSnap.data().last_name;
  
  
    },
  
    async saveProfile () {
        const docRef = doc(db, "candidate_profiles", this.auth.currentUser.email);
        await updateDoc(docRef,{
            "resume": this.resume,
            "first_name": this.firstName,
            "last_name": this.lastName
        })
        console.log("success")
        this.getProfile();
        location.reload();
    }
  
    
  }
  }
  </script>