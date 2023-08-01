<template>
  <section class="section">
    <div class="container">
      <div class="d-flex justify-content-center">
        <div class="col-md-6">
          <div class="form-border"> <!-- Added the form-border -->
            <h2 class="title h2 text-center">Edit Candidate Profile</h2>

            <div class="form-group">
              <label for="firstName" class="form-label">First Name</label>
              <input class="form-control" type="text" v-bind:placeholder="pfirstName" v-model="firstName">
            </div>
            <div class="form-group">
              <label for="lastName" class="form-label">Last Name</label>
              <input class="form-control" type="text" v-bind:placeholder="plastName" v-model="lastName">
            </div>
            <div class="form-group">
              <label for="lastName" class="form-label">Email</label>
              <input class="form-control" type="text" v-bind:placeholder="pemail" v-model="email">
            </div>
            <div class="form-group">
              <label for="resume" class="form-label">Resume</label>
              <input class="form-control" type="file" ref="resumeInput" v-on:change="handleFileUpload">
            </div>
            

            <div class="form-group text-center mt-4"> <!-- Added mt-4 (margin-top: 1rem) -->
              <button class="btn btn-primary" @click="saveProfile">Save</button>
            </div>

            <!-- Details Updated Message -->
            <div v-if="isDetailsUpdated" class="alert alert-success text-center mt-4"> <!-- Added mt-4 (margin-top: 1rem) -->
              Details Updated
            </div>

            <!-- Progress Bar -->
            <div v-if="showProgressBar" class="progress mt-4"> <!-- Added mt-4 (margin-top: 1rem) -->
              <div class="progress-bar" :style="{ width: progress + '%' }">{{ progress }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Add some space between the sections -->
  <div style="height: 30px;"></div>

  <!-- Add the ResumeBuilder component -->
  <ResumeBuilder />
</template>

<!-- The rest of your script and style sections remain unchanged -->


<script>
import { ref } from 'vue';
import { db } from '@/main';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import ResumeBuilder from "@/views/ResumeBuilder.vue";

export default {
  name: 'EditCandidate',
  components: {
    ResumeBuilder
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      pfirstName: '',
      plastName: '',
      pemail: '',
      auth: null,
      storage: null,
      isDetailsUpdated: false,
      showProgressBar: false, // New data property
      progress: 0, // New data property to track the progress
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
        this.pemail = docSnap.data().email;
      } catch (error) {
        console.log('Error fetching user profile:', error);
      }
    },
    async saveProfile() {
      const docRef = doc(db, 'candidate_profiles', this.auth.currentUser.email);
      await updateDoc(docRef, {
        'first_name': this.firstName,
        'last_name': this.lastName,
        'email': this.email
      });
      console.log('success');

      // Show the progress bar and set progress to 0
      this.showProgressBar = true;
      this.progress = 0;

      // Get the file from the input element
      const file = this.$refs.resumeInput.files[0];

      // Upload the resume file to Firebase Storage using the resumable upload
      const storagePath = `resumes/${this.auth.currentUser.email}/resume.pdf`;
      const resumeRef = storageRef(this.storage, storagePath);
      const uploadTask = uploadBytesResumable(resumeRef, file);

      // Listen to the upload progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Update progress as a percentage
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.progress = Math.floor(progress);
        },
        (error) => {
          console.error('Error uploading resume:', error);
          // Hide the progress bar on error
          this.showProgressBar = false;
        },
        () => {
          // Upload complete
          console.log('Resume upload complete');
          // Hide the progress bar after upload completion
          this.showProgressBar = false;
          // Set the details updated message to true and hide it after 3 seconds
          this.isDetailsUpdated = true;
          setTimeout(() => {
            this.isDetailsUpdated = false;
          }, 3000);
        }
      );
    },
  },
};
</script>

<style scoped>
/* The rest of your existing styles */

/* Add border around the form */
.form-border {
  max-width: 600px; /* Adjust the width to match the maximum width of resume-builder */
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.form-border:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
/* Style for the form labels */
.form-label {
  font-weight: bold;
}

/* Style for the Submit button */
.btn-primary {
  color: #fff;
  background-color: #000; /* Change the background color to black */
  border-color: #000; /* Change the border color to black */
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}

/* Style for the Details Updated Message */
.alert-success {
  color: #28a745;
  background-color: #d4edda;
  border-color: #c3e6cb;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  margin-top: 1rem;
}

/* Style for the Progress Bar */
.progress {
  height: 20px;
  border-radius: 5px;
  margin-top: 1rem;
  overflow: hidden;
}

.progress-bar {
  line-height: 20px;
  color: #fff;
  text-align: center;
  background-color: #007bff;
}
</style>


