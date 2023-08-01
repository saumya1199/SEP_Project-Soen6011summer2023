<template>
  <div>
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark" role="navigation" aria-label="main navigation">
        <div class="container">
          <a class="navbar-brand" href="/">
            <h1 class="title">Quick Jobs</h1>
          </a>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <router-link to="/" class="nav-link">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/about" class="nav-link">About</router-link>
              </li>
              <li v-if="isCandidate" class="nav-item">
                <router-link to="/jobs" class="nav-link">Browse Jobs</router-link>
              </li>
              <li v-if="isLoggedOut" class="nav-item">
                <router-link to="/register" class="nav-link">Register</router-link>
              </li>
              <li v-if="isEmployer" class="nav-item">
                <router-link to="/addjob" class="nav-link">Post Jobs</router-link>
              </li>
              <li v-if="isCandidate" class="nav-item">
                <router-link to="/applications" class="nav-link">View Applications</router-link>
              </li>
              <li v-if="isEmployer" class="nav-item">
                <router-link to="/editEmployer" class="nav-link">Edit Employer</router-link>
              </li>
              <li v-if="isEmployer" class="nav-item">
                <router-link to="/applicationsEmployer" class="nav-link">View Applications</router-link>
              </li>
              <li v-if="isCandidate" class="nav-item">
                <router-link to="/editCandidate" class="nav-link">Edit Candidate</router-link>
              </li>
              <li v-if="isAdmin" class="nav-item">
                 <router-link to="/AdminDashboard" class="nav-link">Admin Dashboard</router-link>
              </li>
              
            </ul>
          </div>

          <div class="navbar-nav ml-auto">
            <div class="nav-item">
              <div class="buttons">
                <button v-on:click="handleSignOut" v-if="isLoggedOut" class="btn btn-light">Sign in</button>
                <button v-on:click="handleSignOut" v-if="!isLoggedOut" class="btn btn-light">Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <section class="section">
      <div class="container">
        <router-view />
      </div>
    </section>
  </div>
</template>


<style>
/* Import Bootstrap CSS */
@import 'bootstrap/dist/css/bootstrap.min.css';

/* Custom styles */
body {
  background-color: #f8f9fa;
}

/* Update nav bar style */
.navbar {
  background-color: #343a40;
  padding: 1rem;
}

/* Update nav link style */
.nav-link {
  color: #f8f9fa;
  font-size: 18px;
  margin: 0 10px;
  transition: color 0.3s ease;
}

/* Update nav link style on hover */
.nav-link:hover {
  color: #ced4da;
}

/* Update active nav link style */
.nav-link.active {
  color: #ced4da;
}

/* Update buttons style */
.btn {
  background-color: #17a2b8;
  color: #f8f9fa;
  border-color: #17a2b8;
  font-size: 16px;
  margin: 0 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Update button style on hover */
.btn:hover {
  background-color: #138496;
  color: #f8f9fa;
}

/* Update light button style */
.btn-light {
  background-color: #f8f9fa;
  color: #17a2b8;
  border-color: #17a2b8;
}

/* Update light button style on hover */
.btn-light:hover {
  background-color: #f8f9fa;
  color: #138496;
}
</style>



<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "@/main";
import {
  getCountFromServer,
  query,
  where,
  documentId,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      isLoggedOut: false,
      isCandidate: false,
      isEmployer: false,
      isAdmin: false,
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.isLoggedOut = true;
      } else {
        this.isLoggedOut = false;
        if (
          (await getCountFromServer(
            query(collection(db, "employer_profiles"), where(documentId(), "==", user.email))
          )).data().count == 1
        ) {
          this.isEmployer = true;
        } else {
          this.isEmployer = false;
        }
        if (
          (await getCountFromServer(
            query(collection(db, "candidate_profiles"), where(documentId(), "==", user.email))
          )).data().count == 1
        ) {
          this.isCandidate = true;
        } else {
          this.isCandidate = false;
        }

        if (
          (await getCountFromServer(
            query(collection(db, "admin_profiles"), where(documentId(), "==", user.email))
          )).data().count == 1
        ) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }
    });
  },
  methods: {
    handleSignOut() {
      const auth = getAuth();
      signOut(auth).then(() => {
        this.isCandidate = false;
        this.isEmployer = false;
        this.isAdmin = false; 
        this.$router.push("/login");
      });
    },
  },
};
</script>
