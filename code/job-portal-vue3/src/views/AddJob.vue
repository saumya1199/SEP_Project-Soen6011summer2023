<template>
  <div class="container">
    <div class="custom-box bg-light p-4 rounded">
      <h2 class="custom-title h2">Add a Job</h2>

      <div class="custom-field mb-3">
        <label class="custom-label font-weight-bold">Title</label>
        <div class="custom-control">
          <input class="custom-input form-control" type="text" placeholder="Job Title" v-model="title">
          <span class="custom-icon">
            <i class="fas fa-user"></i>
          </span>
        </div>
      </div>

      <div class="custom-field mb-3">
        <label class="custom-label font-weight-bold">Description</label>
        <div class="custom-control">
          <textarea class="custom-textarea form-control" placeholder="Enter job description" v-model="description"></textarea>
        </div>
      </div>

      <div class="custom-buttons">
        <button v-if="editingJobId" class="custom-button btn btn-primary" @click="updateJobPosting">
          Save Changes
        </button>
        <button v-else class="custom-button btn btn-primary" @click="saveJobPosting">
          Add Job
        </button>
        <button class="custom-button btn btn-secondary" @click="clearForm">
          Clear
        </button>
      </div>

    </div>

    <div v-if="jobPostings.length > 0" class="custom-job-postings mt-4">
      <h2 class="custom-title h2">Job Postings</h2>
      <div v-for="posting in jobPostings" :key="posting.id" class="custom-job-post bg-white p-3 rounded mb-3">
        <div class="custom-job-title">
          <p>{{ posting.title }}</p>
        </div>
        <div class="custom-job-description">
          <p>{{ posting.description }}</p>
        </div>
        <div class="custom-job-actions">
          <button @click="editJobPosting(posting.id)" class="custom-button btn btn-primary">
            Edit
          </button>
          <button @click="deleteJobPosting(posting.id)" class="custom-button btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from 'vue'
import { db } from '@/main'
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs, query, where } from "firebase/firestore"
import { getAuth } from "firebase/auth";

export default {
  name: 'AddJob',
  data() {
    return {
      title: '',
      description: '',
      jobPostings: [],
      auth: null,
      editingJobId: null
    }
  },
  created() {
    this.auth = getAuth();
    this.getJobPostings();
  },

  methods: {
    async saveJobPosting() {
      if (!this.title || !this.description) {
        alert('Please enter a title and description.')
        return
      }

      const docRef = await addDoc(collection(db, 'job_postings'), {
        title: this.title,
        description: this.description,
        author: this.auth.currentUser.email
      });
      console.log('Document written with ID: ', docRef.id);
      this.title = '';
      this.description = '';
      this.getJobPostings();
    },

    async getJobPostings() {
      const postings = [];
      const q = query(collection(db, 'job_postings'), where('author', '==', this.auth.currentUser.email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        postings.push({ id: doc.id, ...doc.data() });
      });
      this.jobPostings = postings;
    },

    async editJobPosting(id) {
      const docRef = doc(db, "job_postings", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        this.title = data.title;
        this.description = data.description;
        this.editingJobId = id;
      } else {
        console.log("No such document!");
      }
    },

    async updateJobPosting() {
      if (!this.title || !this.description) {
        alert("Please enter a title and description.");
        return;
      }

      const docRef = doc(db, "job_postings", this.editingJobId);
      await updateDoc(docRef, {
        title: this.title,
        description: this.description,
        author: this.auth.currentUser.email,
      });

      this.title = "";
      this.description = "";
      this.editingJobId = null;
      this.getJobPostings();
    },

    async deleteJobPosting(id) {
      await deleteDoc(doc(db, "job_postings", id));

      const q = query(collection(db, 'applications'), where('JobPostingId', '==', id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (appDoc) => {
        await deleteDoc(doc(db, 'applications', appDoc.id));
      });

      this.getJobPostings();
    },

    clearForm() {
      this.title = '';
      this.description = '';
      this.editingJobId = null;
    }
  }
}
</script>
