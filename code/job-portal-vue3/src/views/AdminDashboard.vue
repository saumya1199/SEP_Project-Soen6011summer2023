<template>
    <div class="admin-dashboard">
      <h2 class="title">Admin Dashboard</h2>
  
      <!-- Candidate Profiles Management -->
    <section class="admin-section">
      <h3 class="section-title">Candidate Profiles Management</h3>
      <div v-if="candidateProfiles.length > 0">
        <select v-model="selectedCandidate" @change="displayCandidateProfile">
  <option value="" disabled>Select a candidate profile</option>
  <option v-for="profile in candidateProfiles" :value="profile.email" :key="profile.email">
    {{ profile.email }}
  </option>
</select>


<div v-if="selectedCandidate && displayedCandidate">
  <div class="candidate-profile-card">
    <p class="candidate-email">Candidate email: {{ displayedCandidate.email }}</p>
    <p class="candidate-first-name">First Name: {{ displayedCandidate.first_name }}</p>
    <p class="candidate-last-name">Last Name: {{ displayedCandidate.last_name }}</p>
    <!-- Additional candidate profile details can be displayed here -->
  </div>
</div>

      </div>
      <div v-else>
        <p class="section-empty">No candidate profiles available.</p>
      </div>
      <!-- <div class="add-profile">
        <h4>Add New Candidate Profile</h4>
        <div>
          <input type="text" v-model="newCandidate.email" placeholder="Email">
          <input type="text" v-model="newCandidate.first_name" placeholder="First Name">
          <input type="text" v-model="newCandidate.last_name" placeholder="Last Name">
          <button class="btn-add" @click="addCandidateProfile">Add</button>
        </div>
      </div> -->
    </section>

    <!-- Employer Profiles Management -->
    <section class="admin-section">
      <h3 class="section-title">Employer Profiles Management</h3>
      <div v-if="employerProfiles.length > 0">
        <select v-model="selectedEmployer" @change="displayEmployerProfile">
  <option value="" disabled>Select an employer profile</option>
  <option v-for="profile in employerProfiles" :value="profile.company_name" :key="profile.company_name">
    {{ profile.company_name }}
  </option>
</select>

<div v-if="selectedEmployer && displayedEmployer">
  <div class="employer-profile-card">
    <p class="employer-email">Employer Company: {{ displayedEmployer.company_name }}</p>
    <p class="employer-first-name">First Name: {{ displayedEmployer.first_name }}</p>
    <p class="employer-last-name">Last Name: {{ displayedEmployer.last_name }}</p>
    <!-- Additional employer profile details can be displayed here -->
  </div>
</div>

      </div>
      <div v-else>
        <p class="section-empty">No employer profiles available.</p>
      </div>
      <!-- <div class="add-profile">
        <h4>Add New Employer Profile</h4>
        <div>
          <input type="text" v-model="newEmployer.company_name" placeholder="Company Name">
          <input type="text" v-model="newEmployer.first_name" placeholder="First Name">
          <input type="text" v-model="newEmployer.last_name" placeholder="Last Name">
          <button class="btn-add" @click="addEmployerProfile">Add</button>
        </div>
      </div> -->
    </section>
  
      <!-- Job Postings Management -->
  <section class="admin-section">
    <h3 class="section-title">Job Postings Management</h3>
    <div v-if="jobPostings.length > 0">
      <div v-for="jobPosting in jobPostings" :key="jobPosting.id" class="job-posting-card">
        <h4 class="job-title">{{ jobPosting.title }}</h4>
        <p class="job-description">{{ jobPosting.description }}</p>
        <button class="btn-delete" @click="deleteJobPosting(jobPosting.id)">Delete</button>
        <!-- Additional job posting details can be displayed here -->
      </div>
    </div>
    <div v-else>
      <p class="section-empty">No job postings available.</p>
    </div>

    <!-- <div class="add-profile-form">
      <h4>Add New Job Posting</h4>
      <div>
        <label for="jobTitle">Job Title:</label>
        <input type="text" id="jobTitle" v-model="newJobPosting.title" placeholder="Title">
        <label for="jobDescription">Job Description:</label>
        <textarea id="jobDescription" v-model="newJobPosting.description" placeholder="Description"></textarea>
        <button class="btn-add" @click="addJobPosting">Add</button>
      </div>
    </div> -->
  </section>
  
      <!-- Application Tracking -->
      <section class="admin-section">
        <h3 class="section-title">Application Tracking</h3>
        <div v-if="applications.length > 0">
          <div v-for="application in applications" :key="application.id" class="application-card">
            <p class="applicant-email">Applicant email: {{ application.Candidate }}</p>
            <p class="job-title">Job Title: {{ application.Title }}</p>
            <p class="application-status">Status: {{ application.Status }}</p>
            <!-- Additional application details can be displayed here -->
          </div>
        </div>
        <div v-else>
          <p class="section-empty">No job applications available.</p>
        </div>
      </section>
    </div>
  </template>
  
  
  <script>
import { db } from '@/main';
import { collection, getDocs, addDoc, deleteDoc ,doc} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      userProfiles: [],
      candidateProfiles: [],
      employerProfiles: [],
      jobPostings: [],
      applications: [],
      auth: null,
      selectedCandidate: '',
      selectedEmployer: '',
      displayedCandidate: {},
      displayedEmployer: {},
      newCandidate: {
        email: '',
        first_name: '',
        last_name: '',
      },
      newEmployer: {
        company_name: '',
        first_name: '',
        last_name: '',
      },
      newJobPosting: {
        title: '',
        description: '',
      },
    };
  },
  created() {
    this.auth = getAuth();
    this.getUserProfiles();
    this.getCandidateProfiles();
    this.getEmployerProfiles();
    this.getJobPostings();
    this.getApplications();
  },
  methods: {
    
    displayCandidateProfile() {
  this.displayedCandidate = this.candidateProfiles.find(
    (profile) => profile.email === this.selectedCandidate
  );
},

displayEmployerProfile() {
  this.displayedEmployer = this.employerProfiles.find(
    (profile) => profile.company_name === this.selectedEmployer
  );
},


    async getUserProfiles() {
      const userProfiles = [];
      const q = collection(db, 'user_profiles');
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        userProfiles.push(doc.data());
      });
      this.userProfiles = userProfiles;
    },
    async getCandidateProfiles() {
      const candidateProfiles = [];
      const q = collection(db, 'candidate_profiles');
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        candidateProfiles.push(doc.data());
      });
      this.candidateProfiles = candidateProfiles;
    },
    async getEmployerProfiles() {
      const employerProfiles = [];
      const q = collection(db, 'employer_profiles');
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        employerProfiles.push(doc.data());
      });
      this.employerProfiles = employerProfiles;
    },
    async getJobPostings() {
      const jobPostings = [];
      const q = collection(db, 'job_postings');
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        jobPostings.push({ id: doc.id, ...doc.data() });
      });
      this.jobPostings = jobPostings;
    },
    async getApplications() {
      const applications = [];
      const q = collection(db, 'applications');
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        applications.push({ id: doc.id, ...doc.data() });
      });
      this.applications = applications;
    },
    async addCandidateProfile() {
      try {
        const docRef = await addDoc(collection(db, 'candidate_profiles'), this.newCandidate);
        this.newCandidate = {
          email: '',
          first_name: '',
          last_name: '',
        };
        alert('Candidate profile added successfully!');
      } catch (error) {
        alert('Error adding candidate profile: ' + error.message);
      }
    },
    async addEmployerProfile() {
      try {
        const docRef = await addDoc(collection(db, 'employer_profiles'), this.newEmployer);
        this.newEmployer = {
          company_name: '',
          first_name: '',
          last_name: '',
        };
        alert('Employer profile added successfully!');
      } catch (error) {
        alert('Error adding employer profile: ' + error.message);
      }
    },
    async deleteCandidateProfile(profileId) {
      try {
        await deleteDoc(collection(db, 'candidate_profiles'), profileId);
        alert('Candidate profile deleted successfully!');
        this.getCandidateProfiles();
      } catch (error) {
        alert('Error deleting candidate profile: ' + error.message);
      }
    },
    async deleteEmployerProfile(profileId) {
      try {
        await deleteDoc(collection(db, 'employer_profiles'), profileId);
        alert('Employer profile deleted successfully!');
        this.getEmployerProfiles();
      } catch (error) {
        alert('Error deleting employer profile: ' + error.message);
      }
    },
    async addJobPosting() {
    try {
      const docRef = await addDoc(collection(db, 'job_postings'), this.newJobPosting);
      this.newJobPosting = {
        title: '',
        description: '',
      };
      alert('Job posting added successfully!');
    } catch (error) {
      alert('Error adding job posting: ' + error.message);
    }
  },
  async deleteJobPosting(jobPostingId) {
    try {
      await deleteDoc(doc(db, 'job_postings', jobPostingId));
      alert('Job posting deleted successfully!');
      this.getJobPostings();
    } catch (error) {
      alert('Error deleting job posting: ' + error.message);
    }
  },
  },
};
</script>

  
<style scoped>
.admin-dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
}

.admin-section {
  margin-top: 30px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.user-profile-card,
.candidate-profile-card,
.employer-profile-card,
.job-posting-card,
.application-card {
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  margin-bottom: 20px;
}

.user-profile-card:hover,
.candidate-profile-card:hover,
.employer-profile-card:hover,
.job-posting-card:hover,
.application-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-email,
.candidate-email,
.employer-email,
.job-title,
.applicant-email,
.job-description,
.application-status,
.user-first-name,
.user-last-name,
.candidate-first-name,
.candidate-last-name,
.employer-first-name,
.employer-last-name {
  font-size: 16px;
  margin-bottom: 10px;
}

.section-empty {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-top: 1rem;
}

.add-profile-form {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-profile-form h4 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.add-profile-form label {
  font-size: 16px;
  margin-bottom: 5px;
}

.add-profile-form input[type="text"],
.add-profile-form input[type="email"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-profile-form button {
  background-color: #000;
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-profile-form button.cancel-button {
  background-color: #ccc;
  margin-right: 10px;
}

select {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>