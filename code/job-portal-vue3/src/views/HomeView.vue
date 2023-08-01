<template>
  <div class="section">
    <div class="container">
      <h1 class="title">Welcome to Quick Jobs</h1>

      <div class="field">
        <div class="control">
          <p class="name">
            <span class="first-name">{{ pfirstName }}</span>&nbsp;<span class="last-name">{{ plastName }}</span>
          </p>
        </div>
      </div>
      <!-- Add admin-specific content -->
      <div v-if="isAdmin">
        <!-- Your admin-specific content goes here -->
        <p class="admin-content">Hello Administrator</p>
        <!-- <p class="admin-content">This content is only visible to admins.</p> -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { db } from '@/main';
import { getDoc, doc } from 'firebase/firestore';
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
      isAdmin: false
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

</style>