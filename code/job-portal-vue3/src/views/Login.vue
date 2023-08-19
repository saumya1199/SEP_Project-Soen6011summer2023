<template>
  <section class="section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="login-form-container">
            <h2 class="title h2">Sign in</h2>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <div class="input-group">
                <input class="form-control" type="text" placeholder="Email" v-model="email">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <div class="input-group">
                <input class="form-control" type="password" placeholder="Password" v-model="password">
              </div>
            </div>
            <div class="mb-3">
              <p class="text-danger" v-if="errMsg">{{ errMsg }}</p>
            </div>
            <div class="mb-3 text-center">
              <button class="btn btn-primary" v-on:click="login">Submit</button>
            </div>
            <div class="mb-3 text-center">
              <button class="btn btn-google" @click="googleLogin">
                <i class="fab fa-google"></i> Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import router from '../router';

export default {
  name: 'SignIn',
  setup() {
    const email = ref("");
    const password = ref("");
    const errMsg = ref("");

    const login = () => {
      signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then(() => {
          console.log("Successfully signed in!");
          checkAdminStatus(email.value);
        })
        .catch((error) => {
          console.log(error.code);
          switch (error.code) {
            // Handle different error cases
          }
        });
    };

    const googleLogin = async () => {
      try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        await signInWithPopup(auth, provider);
        
        checkNewUser();
      } catch (error) {
        console.log(error.code);
        switch (error.code) {
          // Handle different error cases
        }
      }
    };

    const checkAdminStatus = (email) => {
      if (email === "adminuser@gmail.com") {
        router.push('/AdminDashboard');
      } else {
        router.push('/');
      }
    };

    const getCurrentUser = () => {
      return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
          getAuth(),
          (user) => {
            removeListener();
            resolve(user);
          },
          reject
        );
      });
    };

    const checkNewUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        if (currentUser.providerData.length === 1 && currentUser.providerData[0].providerId === "google.com") {
          const isNew = await isNewUserInFirestore(currentUser.email);
          if (isNew) {
            router.push('/RegisterChoice');
          } else {
            checkAdminStatus(currentUser.email);
          }
        } else {
          checkAdminStatus(currentUser.email);
        }
      }
    };

    const isNewUserInFirestore = async (email) => {
  const db = getFirestore();

  // Check in candidate_profiles
  const candidateProfilesCollection = collection(db, "candidate_profiles");
  const candidateQuery = query(candidateProfilesCollection, where("email", "==", email));
  const candidateQuerySnapshot = await getDocs(candidateQuery);
  
  if (!candidateQuerySnapshot.empty) {
    return false; // User is not new in candidate_profiles
  }

  // Check in employer_profiles
  const employerProfilesCollection = collection(db, "employer_profiles");
  const employerQuery = query(employerProfilesCollection, where("email", "==", email));
  const employerQuerySnapshot = await getDocs(employerQuery);
  
  if (!employerQuerySnapshot.empty) {
    return false; // User is not new in employer_profiles
  }
//

  // If the email is not found in candidate_profiles or employer_profiles, then it's a new user
  return true;
};



    checkNewUser();

    return { email, password, errMsg, login, googleLogin };
  }
};
</script>






<style scoped>
/* Old Working Custom Styles */
.h2 {
  font-size: 2rem;
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

.btn-primary {
  color: #fff;
  background-color: #000; /* Change the background color to black */
  border-color: #000; /* Change the border color to black */
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.text-danger {
  color: #dc3545;
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

/* New style for the login form container */
.login-form-container {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1.5rem;
  width: 80%; /* Increased width to 80% */
  margin: 0 auto; /* Center the form container horizontally */
}
</style>


