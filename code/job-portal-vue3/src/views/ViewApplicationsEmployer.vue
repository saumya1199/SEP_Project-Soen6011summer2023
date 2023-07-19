<template>
  <div v-if="applications.length > 0">
    <h2 class="title is-4">Applications</h2>
    <div v-for="posting in applications" :key="posting.id" class="card mb-3">
      <div class="card-content">
        <div class="columns is-mobile is-vcentered">
          <div class="column is-6">
            <p class="candidate-email">Candidate email: {{ posting.Candidate }}</p>
            <div class="resume-download">
              <button @click="getDownloadURL(posting)">View Resume</button>
              <div v-if="downloadURL">
                <a :href="downloadURL" target="_blank">View Resume</a>
              </div>
            </div>
            <h4 class="card-header-title">{{ posting.Title }}</h4>
            <p>{{ posting.Description }}</p>
          </div>
          <div class="column is-6 has-text-right">
            <p class="status">{{ posting.Status }}</p>
            <button
              v-if="posting.Status === 'Pending'"
              class="button is-danger deny-button"
              @click="denyApplication(posting.id)"
            >
              Deny
            </button>
            <button
              v-if="posting.Status === 'Pending'"
              class="button is-success approve-button"
              @click="approveApplication(posting.id)"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p class="no-applications">No applications available.</p>
  </div>
</template>

<script>
import { db } from "@/main";
import {
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";
import { getStorage } from "firebase/storage";

export default {
  name: "ViewApplication",
  data() {
    return {
      applications: [],
      jobPostings: [],
      auth: null,
      downloadURL: null,
    };
  },
  created() {
    this.auth = getAuth();
    this.getApplications();
    this.getJobPostings();
  },
  methods: {
    async getJobPostings() {
      const postings = [];
      const q = query(collection(db, "job_postings"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        postings.push({ id: doc.id, ...doc.data() });
      });
      this.jobPostings = postings;
    },
    async getApplications() {
      const postings = [];
      const q = query(
        collection(db, "applications"),
        where("Employer", "==", this.auth.currentUser.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        postings.push({ id: doc.id, ...doc.data() });
      });
      this.applications = postings;
    },
    async denyApplication(postingId) {
      const docRef = doc(db, "applications", postingId);
      await updateDoc(docRef, {
        Status: "Denied",
      });
      alert("Application denied successfully!");
      location.reload();
    },
    async approveApplication(postingId) {
      const docRef = doc(db, "applications", postingId);
      await updateDoc(docRef, {
        Status: "Approved",
      });
      alert("Application approved successfully!");
      location.reload();
    },
    getDownloadURL(posting) {
      const storage = getStorage();
      const filePath = `resumes/${posting.Candidate}/resume.pdf`;
      const fileRef = ref(storage, filePath);
      getDownloadURL(fileRef)
        .then((url) => {
          this.downloadURL = url;
        })
        .catch((error) => {
          console.error("Error retrieving download URL:", error);
        });
    },
  },
};
</script>

<style scoped>
.card {
  background-color: #f8f8f8;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  color: #333;
  margin-bottom: 1rem;
}

.candidate-email {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.resume-download {
  margin-bottom: 1rem;
}

.resume-download button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.resume-download a {
  display: block;
  margin-top: 0.5rem;
  text-decoration: underline;
  color: #007bff;
}

.deny-button {
  margin-right: 10px;
}

.approve-button {
  margin-left: 10px;
}

.status {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.no-applications {
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-top: 1rem;
}
</style>
