<template>
  <section class="section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="form-border"> <!-- Added the form-border -->
            <h2 class="title h2 text-center">Edit Employer Profile</h2>
            <div class="form-group">
              <label for="companyName" class="label">Company Name</label>
              <input class="form-control" type="text" v-bind:placeholder="pcompanyName" v-model="companyName" id="companyName">
            </div>
            <div class="form-group">
              <label for="firstName" class="label">First Name</label>
              <input class="form-control" type="text" v-bind:placeholder="pfirstName" v-model="firstName" id="firstName">
            </div>
            <div class="form-group">
              <label for="lastName" class="label">Last Name</label>
              <input class="form-control" type="text" v-bind:placeholder="plastName" v-model="lastName" id="lastName">
            </div>
            
            <div class="form-group text-center">
              <button class="btn btn-success" v-on:click="saveProfile">Save</button>
            </div>

            <div class="form-group text-center" v-if="successMessage">
              <p class="text-success">{{ successMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<style scoped>
/* Custom Styles */

.section {
  padding: 3rem 0;
}

.container {
  max-width: 960px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.col-md-6 {
  flex: 0 0 66.666667%;
  max-width: 66.666667%;
}

@media (max-width: 768px) {
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

.title.is-2 {
  font-size: 2rem;
}

.text-center {
  text-align: center;
}

.label {
  font-weight: bold;
}

/* Target form elements specifically */
.form-group input.form-control {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn-success {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.text-success {
  color: #28a745;
}

/* Add border around the form */
.form-border {
  border: 1px solid #ccc;
  border-radius: 10px; /* Increase border radius */
  padding: 1.5rem;
  width: 80%;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.form-border:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Add margin to the bottom of the last name form group */
.form-group:last-child {
  margin-bottom: 1rem;
}
</style>




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
      companyName: '',
      pfirstName: '',
      plastName: '',
      pcompanyName: '',
      auth: null,
      successMessage: '', // New success message property

    }
  },
  created() {
    // Get the user object from the promise returned by getAuth()
    this.auth = getAuth();
    this.getProfile();
  },
  methods: {  
    async getProfile () {
      const docRef = doc(db, "employer_profiles", this.auth.currentUser.email);
      const docSnap = await ( getDoc(docRef));
      this.pcompanyName = docSnap.data().company_name;
      this.pfirstName = docSnap.data().first_name;
      this.plastName = docSnap.data().last_name;
    },
    async saveProfile () {
      const docRef = doc(db, "employer_profiles", this.auth.currentUser.email);
      await updateDoc(docRef, {
        "company_name": this.companyName,
        "first_name": this.firstName,
        "last_name": this.lastName
      });

      // Set success message after saving profile
      this.successMessage = 'Profile successfully saved!';
      
      // Reset the success message after a few seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);

      // ... Other saveProfile logic ...
    }
  }
}
</script>

