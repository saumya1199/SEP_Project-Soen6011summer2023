<template>
  <div v-if="jobPostings.length > 0">
    <h2 class="title is-4">Job Postings</h2>
    <div v-for="posting in jobPostings" :key="posting.id" class="card mb-1">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col">
            <h5 class="card-title">{{ posting.title }}</h5>
            <p class="card-text">{{ posting.description }}</p>
          </div>
          <div class="col-5 text-end">
            <button class="btn btn-success" v-on:click="ApplytoJob(posting.id)">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { db } from '@/main'
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { getAuth } from "firebase/auth";

export default {
  name: 'AddJob',
  data() {
    return {
      title: '',
      description: '',
      jobPostings: [],
      auth: null
    }
  },
  created() {
    // Get the user object from the promise returned by getAuth()
    this.auth = getAuth();
    this.getJobPostings();
  },

  methods: {
    async getJobPostings() {
      const postings = [];
      const q = query(collection(db, 'job_postings'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        postings.push({ id: doc.id, ...doc.data() });
      });
      this.jobPostings = postings;
    },

    async ApplytoJob(postingId) {
      const currentUser = this.auth.currentUser;
      const postingRef = doc(db, 'job_postings', postingId);
      const postingSnapshot = await getDoc(postingRef);
      const postingData = postingSnapshot.data();

      const userRef = doc(db, 'candidate_profiles', this.auth.currentUser.email);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      console.log(userData);

      // Save application data in the database
      await addDoc(collection(db, 'applications'), {
        Candidate: currentUser.email,
        JobPostingId: postingId,
        Employer: postingData.author,
        DateApplied: new Date(),
        Description: postingData.description,
        Title: postingData.title,
        Status: 'Pending',
        Resume: userData.resume
      });

      // Notify the user that the application was submitted successfully
      alert('Application submitted successfully!');
    }
  }
}
</script>

<style scoped>
.job-posting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.delete-button {
  margin-left: 10px;
}
</style>
