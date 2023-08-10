<template>
    <section class="section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="register-form-container">
              <h1 class="title">Create an Account</h1>
              <div class="mb-3 text-center">
                <button class="btn btn-black" @click="registerAs('candidate')">Register as Candidate</button>
                <button class="btn btn-black" @click="registerAs('employer')" style="margin-top: 10px;">Register as Employer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
  import { doc, setDoc } from "firebase/firestore";
  import router from '../router';
  import { db } from '@/main';
  
  export default {
    setup() {
      // ...
  
      const registerAs = async (role) => {
        try {
          const auth = getAuth();
          const userCredential = auth.currentUser;
  
          if (userCredential) {
            const email = userCredential.email;
  
            if (role === 'candidate') {
              await setDoc(doc(db, "candidate_profiles", email), {
                first_name: "",
                last_name: "",
                resume: ""
              });
              router.push('/EditCandidate');
            } else if (role === 'employer') {
              await setDoc(doc(db, "employer_profiles", email), {
                company_name: "",
                first_name: "",
                last_name: ""
              });
              router.push('/EditEmployer');
            }
          }
        } catch (error) {
          console.log(error.code);
          alert(error.message);
        }
      };
  
      return {
        registerAs
      };
    }
  }
  </script>
  
  
  
  <style scoped>
  /* Old Working Custom Styles */
  .title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .form-label {
    font-weight: bold;
  }
  
  .input-group {
    width: 100%;
  }
  
  .form-control {
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .btn-black {
    color: #fff;
    background-color: #000;
    border-color: #000;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .text-center {
    text-align: center;
  }
  
  /* New style for the register form container */
  .register-form-container {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 1.5rem;
    width: 80%; /* Increased width to 80% */
    margin: 0 auto; /* Center the form container horizontally */
  }
  
  /* Additional Styles */
  .section {
    padding: 3rem 0;
  }
  
  .container {
    max-width: 960px; /* Adjust container max-width if necessary */
  }
  
  .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .col-md-6 {
    flex: 0 0 66.666667%;
    max-width: 66.666667%;
  }
  
  @media (max-width: 768px) {
    .col-md-6 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
  </style>
  