<template>
  <div class="section">
    <div class="container">
      <h1 class="title">Welcome to Quick Jobs</h1>

      <div class="name">
        <span class="first-name">{{ pfirstName }}</span>&nbsp;<span class="last-name">{{ plastName }}</span>
      </div>

      <div class="search-container">
        <div class="input-group search-group">
          <input
            v-model="searchQuery"
            class="form-control form-control-search"
            type="text"
            placeholder="Search job listings..."
          />
          <button class="btn btn-search" @click="searchJobs">Search</button>
        </div>
      </div>

      <div v-if="searchResults.length === 0" class="search-results">
        No results found.
      </div>
      <div v-else class="search-results">
        <h2>Search Results:</h2>
        <div v-for="(result, index) in searchResults" :key="index" class="search-result">
          <h3>{{ result.title }}</h3>
          <p>{{ result.description }}</p>
          <!-- Display other job listing details here -->
        </div>
      </div>

      <!-- Add admin-specific content -->
      <div v-if="isAdmin">
        <!-- Your admin-specific content goes here -->
        <p class="admin-content">Hello Administrator</p>
      </div>
    </div>
  </div>
</template>





<script>
import { ref } from 'vue';
import { db } from '@/main';
import { getDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  name: 'HomeView',
  data() {
    return {
      pfirstName: '',
      plastName: '',
      auth: null,
      isCandidate: false,
      isEmployer: false,
      isAdmin: false,
      searchQuery: '',
      searchResults: []
    };
  },
  created() {
    this.auth = getAuth();
    this.getProfile();
    this.checkProfileType();
  },
  methods: {
    async getProfile() {
  try {
    const candidateDocRef = doc(db, 'candidate_profiles', this.auth.currentUser.email);
    const candidateDocSnap = await getDoc(candidateDocRef);

    const employerDocRef = doc(db, 'employer_profiles', this.auth.currentUser.email);
    const employerDocSnap = await getDoc(employerDocRef);

    if (candidateDocSnap.exists()) {
      this.pfirstName = candidateDocSnap.data().first_name;
      this.plastName = candidateDocSnap.data().last_name;
    } else if (employerDocSnap.exists()) {
      // If user is an employer, use data from employer_profiles
      this.pfirstName = employerDocSnap.data().first_name;
      this.plastName = employerDocSnap.data().last_name;
    } else {
      console.log('User profile does not exist.');
    }
  } catch (error) {
    console.log('Error fetching user profile:', error);
  }
},
async checkProfileType() {
      try {
        const employerDocRef = doc(db, 'employer_profiles', this.auth.currentUser.email);
        const employerDocSnap = await getDoc(employerDocRef);
        this.isEmployer = employerDocSnap.exists();

        const adminDocRef = doc(db, 'admin_profiles', this.auth.currentUser.email);
        const adminDocSnap = await getDoc(adminDocRef);
        this.isAdmin = adminDocSnap.exists();
      } catch (error) {
        console.log('Error checking profiles:', error);
      }
      // Assuming only one of either candidate, employer, or admin profiles can exist for a user
      this.isCandidate = !this.isEmployer && !this.isAdmin;
    },
    async searchJobs() {
  try {
    const jobCollectionRef = collection(db, 'job_postings');
    const querySnapshot = await getDocs(jobCollectionRef);

    const partialMatchResults = querySnapshot.docs
      .map(doc => doc.data())
      .filter(result => result.title.toLowerCase().includes(this.searchQuery.toLowerCase()));

    console.log('Partial Match Results:', partialMatchResults);
    this.searchResults = partialMatchResults;
  } catch (error) {
    console.error('Error searching job listings:', error);
  }
}





  }
};
</script>

<style scoped>
.section {
  margin-top: 2rem;
}


.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 1rem;
}

.field {
  margin-bottom: 1.5rem;
}

.control {
  display: flex;
}

.name {
  font-size: 24px;
  color: #777;
  margin-bottom: 0.5rem;
}

.first-name {
  font-weight: bold;
}

.last-name {
  font-weight: bold;
}

.admin-content {
  font-size: 40px; /* Adjust the font size to make it bigger */
  font-weight: bold; /* Optionally, make the text bold */
  color: #007bff; /* Optionally, change the text color */
  margin-top: 20px; /* Optionally, add some top margin to separate it from the other content */
}
 .search-results {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}



.search-result {
  margin-bottom: 1.5rem;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
}


.form-control-search {
 
  padding: 1rem;
  font-size: 1rem;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn-search {
  color: #fff;
  background-color: #000;
  border-color: #000;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem; /* Optional: Add margin to space it from other content */
}

.search-group {
  max-width: 400px; /* Adjust the max-width as needed */
  margin: 0 auto; /* Center the search group horizontally */
}

</style>
