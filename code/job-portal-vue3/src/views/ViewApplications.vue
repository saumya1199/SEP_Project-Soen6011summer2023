<template>
  <div class="container mt-4">
    <h2 class="title">Job Applications</h2>
    <div v-if="applications.length > 0">
      <div v-for="posting in applications" :key="posting.id" class="card mb-3">
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <h5 class="card-title">{{ posting.Title }}</h5>
              <p class="card-text">{{ posting.Description }}</p>
            </div>
            <div class="col-md-4 text-end">
              <p class="fw-bold">{{ posting.Status }}</p>
              <button
                v-if="posting.Status === 'Pending'"
                class="btn btn-danger"
                v-on:click="deleteApplication(posting.id)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="lead">No applications available.</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { db } from '@/main';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  name: 'ViewApplication',
  data() {
    return {
      applications: [],
      auth: null,
    };
  },
  created() {
    this.auth = getAuth();
    this.getApplications();
  },

  methods: {
    async getApplications() {
      const postings = [];
      const q = query(collection(db, 'applications'), where('Candidate', '==', this.auth.currentUser.email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        postings.push({ id: doc.id, ...doc.data() });
      });
      this.applications = postings;
    },

    async deleteApplication(postingId) {
      await deleteDoc(doc(db, 'applications', postingId));
      alert('Application deleted successfully!');
      this.getApplications();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

.card {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.card-title {
  font-size: 24px;
}

.card-text {
  font-size: 16px;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
}

.text-end {
  text-align: end;
}
</style>
