<template>
  <section class="section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="login-form-container"> <!-- Added the login-form-container -->
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
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

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


<script>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import router from '../router';

export default {
  name: 'SignIn',
  setup() {
    const email = ref("");
    const password = ref("");
    const errMsg = ref("");

    const login = () => {
      signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
          console.log("Successfully signed in!");
          // After successful login, check if the user is an admin
          checkAdminStatus(email.value);
        })
        .catch((error) => {
          console.log(error.code);
          switch (error.code) {
            case "auth/invalid-email":
              errMsg.value = "Invalid email";
              break;

            case "auth/user-not-found":
              errMsg.value = "No account with that email was found";
              break;

            case "auth/wrong-password":
              errMsg.value = "Incorrect password";
              break;

            default:
              errMsg.value = "Email or password was incorrect";
              break;
          }
        });
    };

    const checkAdminStatus = (email) => {
      // You may need to fetch the admin_profiles collection here and check if the user's email is in the list of admins
      // For simplicity, let's assume the admin email is "admin@example.com"
      if (email === "adminuser@gmail.com") {
        // Grant admin access and navigate to the admin dashboard
        router.push('/AdminDashboard');
      } else {
        // For non-admin users, navigate to the regular user dashboard
        router.push('/');
      }
    };

    return { email, password, errMsg, login };
  }
};
</script>