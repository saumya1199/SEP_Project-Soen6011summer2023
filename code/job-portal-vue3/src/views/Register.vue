<template>
  <section class="section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="register-form-container"> <!-- Added the register-form-container -->
            <h1 class="title">Create an Account</h1>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <div class="input-group">
                <input class="form-control" type="email" placeholder="Email" v-model="email" />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <div class="input-group">
                <input class="form-control" type="password" placeholder="Password" v-model="password" />
              </div>
            </div>
            <div class="mb-3 text-center">
              <button class="btn btn-black" v-on:click="registerEMP">Register as Employer</button>
              <div></div>
              <button class="btn btn-black" v-on:click="registerCAN" style="margin-top: 10px;">Register as Candidate</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

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

<script>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router';
import router from '../router';
import { doc, setDoc, collection, addDoc, getFirestore } from "firebase/firestore";
import { db } from '@/main';

export default {
  setup() {
    const email = ref("");
    const password = ref("");

    const registerEMP = async () => {
      createUserWithEmailAndPassword(getAuth(), email.value, password.value)
        .then(async (data) => {
          console.log("Successfully registered");
          await setDoc(doc(db, "employer_profiles", email.value), {
            company_name: "",
            first_name: "",
            last_name: ""
          });
          router.push('/editEmployer');
        })
        .catch((error) => {
          console.log(error.code);
          alert(error.message);
        });
    };

    const registerCAN = async () => {
      createUserWithEmailAndPassword(getAuth(), email.value, password.value)
        .then(async (data) => {
          console.log("Successfully registered");
          await setDoc(doc(db, "candidate_profiles", email.value), {
            first_name: "",
            last_name: "",
            resume: ""
          });
          router.push('/editCandidate');
        })
        .catch((error) => {
          console.log(error.code);
          alert(error.message);
        });
    };

    return {
      email,
      password,
      registerEMP,
      registerCAN
    };
  }
}
</script>
