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
      isEmployer: false
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
      } catch (error) {
        console.log('Error checking employer profile:', error);
      }
      // Assuming only one of either candidate or employer profiles can exist for a user
      this.isCandidate = !this.isEmployer;
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
</style>