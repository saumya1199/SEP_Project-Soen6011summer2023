<template>
  <div>
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
              <button
                v-if="!hasApplied(posting.id)"
                class="btn btn-success"
                v-on:click="ApplytoJob(posting.id)"
              >
                Apply
              </button>
              <button
                v-else
                class="btn btn-secondary"
                disabled
              >
                Applied
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No job postings available.</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { db } from '@/main'
import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { getAuth } from "firebase/auth";

export default {
  name: 'AddJob',
  data() {
    return {
      title: '',
      description: '',
      jobPostings: [],
      auth: null,
      appliedJobs: [] // Keeps track of applied job postings
    }
  },
  created() {
    // Get the user object from the promise returned by getAuth()
    this.auth = getAuth();
    this.getJobPostings();
    this.getAppliedJobs();
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

      // Check if the candidate has already applied for this job
      const applicationQuery = query(
        collection(db, 'applications'),
        where('Candidate', '==', currentUser.email),
        where('JobPostingId', '==', postingId)
      );

      const existingApplications = await getDocs(applicationQuery);

      if (!existingApplications.empty) {
        alert('You have already applied for this job.');
        return; // Exit the function without submitting the application again.
      }

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

      // Add the applied job posting to the appliedJobs array
      this.appliedJobs.push(postingId);
    },

    hasApplied(postingId) {
      // Check if the job posting ID exists in the appliedJobs array
      return this.appliedJobs.includes(postingId);
    },

    async getAppliedJobs() {
      // Fetch the user's applied jobs from the "applications" collection
      const currentUser = this.auth.currentUser;
      const applicationQuery = query(
        collection(db, 'applications'),
        where('Candidate', '==', currentUser.email)
      );
      const applicationsSnapshot = await getDocs(applicationQuery);

      // Populate the appliedJobs array with the job posting IDs
      this.appliedJobs = applicationsSnapshot.docs.map(doc => doc.data().JobPostingId);
    }
  }
}
</script>

<style>
.job-posting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

/* Apply button style */
.btn-success {
  background-color: #28a745;
  color: white;
  cursor: pointer;
}

/* Applied button style */
.btn-secondary {
  background-color: #6c757d;
  color: white;
  cursor: not-allowed;
}
</style>
