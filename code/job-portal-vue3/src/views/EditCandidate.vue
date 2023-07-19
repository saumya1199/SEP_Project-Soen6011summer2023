<template>
  <section class="section">
    <div class="container">
      <h2 class="title is-2">Edit Candidate Profile</h2>
      
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
          <input class="input" type="file" ref="resumeInput" v-on:change="handleFileUpload">
        </div>
      </div>
      
      <div class="field">
        <button class="button is-success" v-on:click="saveProfile">Save</button>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';
import { db } from '@/main';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';

export default {
  name: 'EditEmployer',
  data() {
    return {
      firstName: '',
      lastName: '',
      pfirstName: '',
      plastName: '',
      auth: null,
      storage: null
    };
  },
  created() {
    this.auth = getAuth();
    this.storage = getStorage();
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const docRef = doc(db, 'candidate_profiles', this.auth.currentUser.email);
        const docSnap = await getDoc(docRef);
        this.pfirstName = docSnap.data().first_name;
        this.plastName = docSnap.data().last_name;
      } catch (error) {
        console.log('Error fetching user profile:', error);
      }
    },
    async saveProfile() {
      const docRef = doc(db, 'candidate_profiles', this.auth.currentUser.email);
      await updateDoc(docRef, {
        'first_name': this.firstName,
        'last_name': this.lastName
      });
      console.log('success');

      // Get the file from the input element
      const file = this.$refs.resumeInput.files[0];

      // Upload the resume file to Firebase Storage
      const storagePath = `resumes/${this.auth.currentUser.email}/resume.pdf`;
      const resumeRef = storageRef(this.storage, storagePath);
      await uploadBytes(resumeRef, file);

      this.fetchProfile();
      location.reload();
    }
  }
};
</script>

