<template>
  <div v-if="applications.length > 0">
    <h2 class="title">Applications</h2>
    <div v-for="posting in applications" :key="posting.id" class="custom-card">
      <div class="card-content">
        <div class="custom-columns">
          <div class="custom-column">
            <p class="candidate-email">Candidate email: {{ posting.Candidate }}</p>
            <div class="resume-download">
              <button @click="openResume(posting)">View Resume</button>
            </div>
            <h4 class="custom-card-header-title">{{ posting.Title }}</h4>
            <p>{{ posting.Description }}</p>
          </div>
          <div class="custom-column has-text-right">
            <p class="status">{{ posting.Status }}</p>
            <button
              v-if="posting.Status === 'Pending'"
              class="custom-button deny-button"
              @click="denyApplication(posting.id)"
            >
              Deny
            </button>
            <button
  v-if="posting.Status === 'Pending'"
  class="custom-button interview-button"
  @click="callForInterviewApplication(posting.id)"
>
  Call for Interview
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


<style scoped>
/* Custom Styles */

.custom-card {
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  margin-bottom: 20px;
}

.custom-card:hover {
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
  background-color: #000; /* Change the background color to black */
  color: #fff; /* Change the text color to white */
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.custom-button {
  background-color: #000; /* Change the background color to black */
  color: #fff; /* Change the text color to white */
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.deny-button {
  background-color: #000; /* Change the background color to black */
  color: #fff; /* Change the text color to white */
  margin-right: 10px;
}

.approve-button {
  background-color: #000; /* Change the background color to black */
  color: #fff; /* Change the text color to white */
  margin-left: 10px;
}

.status {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #28a745; /* Color for Approved status */
}

.status.pending {
  color: #dc3545; /* Color for Pending status */
}

.no-applications {
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-top: 1rem;
}
.interview-button {
  background-color: #007bff; /* Change the background color to blue */
  color: #fff; /* Change the text color to white */
  margin-left: 10px;
}

</style>




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
import sgMail from '@sendgrid/mail';
import axios from 'axios';

sgMail.setApiKey('S');
const backendUrl = 'http://localhost:3000';

export default {
  name: "ViewApplication",
  data() {
    return {
      applications: [],
      jobPostings: [],
      auth: null,
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
    // async approveApplication(postingId) {
    //   const docRef = doc(db, "applications", postingId);
    //   await updateDoc(docRef, {
    //     Status: "Approved",
    //   });
    //   alert("Application approved successfully!");
    //   location.reload();
    // },
    openResume(posting) {
      const storage = getStorage();
      const filePath = `resumes/${posting.Candidate}/resume.pdf`;
      const fileRef = ref(storage, filePath);
      getDownloadURL(fileRef)
        .then((url) => {
          window.open(url, '_blank'); // Open the resume in a new tab
        })
        .catch((error) => {
          console.error("Error retrieving download URL:", error);
        });
    },

  //   async callForInterviewApplication(postingId) {
  // const response = await axios.post(
  //   'http://localhost:3000/send-email', // Your backend server URL
  //   { candidateEmail: 'imadshawl@ymail.com' } // Sample data, replace with actual data
  // );

  // if (response.status === 200) {
  //   console.log('Email sent successfully');
  // } else {
  //   console.error('Error sending email:', response.data);
  // }

  // Rest of your code
// }


async callForInterviewApplication(postingId) {
  const docRef = doc(db, "applications", postingId);
  await updateDoc(docRef, {
    Status: "Interview",
  });

  // Retrieve the application details to get the candidate's email
  const application = this.applications.find(app => app.id === postingId);
  const candidateEmail = application.Candidate; // Candidate's email

  try {
    const response = await axios.post(
      'http://localhost:3000/send-email', // Your backend server URL
      { candidateEmail } // Use the candidate's email
    );

    if (response.status === 200) {
      console.log('Email sent successfully');
      // Update the application status in the UI
      application.Status = "Interview";
      // Show the success alert and update the button text
      alert("Candidate called for an interview!");
    } else {
      console.error('Error sending email:', response.data);
    }
  } catch (error) {
    console.error("Error sending interview invitation email:", error);
  }

  // Reload the applications list
  await this.getApplications();
},


//     async callForInterviewApplication(postingId) {
//       const docRef = doc(db, "applications", postingId);
//       await updateDoc(docRef, {
//         Status: "Interview",
//       });

//       // Retrieve the application details to get the candidate's email
//       const application = this.applications.find(app => app.id === postingId);
//       const candidateEmail = application.Candidate; // Candidate's email

//       try {
//         // Call the email sending function
//         await this.sendInterviewEmail(candidateEmail);
//         console.log("Interview invitation email sent successfully.");
//       } catch (error) {
//         console.error("Error sending interview invitation email:", error);
//       }

//       alert("Candidate called for an interview!");
//       location.reload();
//     },

//     async sendInterviewEmail(candidateEmail) {
//   const emailData = {
//     personalizations: [
//       {
//         to: [{ email: candidateEmail }],
//         subject: 'Interview Invitation',
//       },
//     ],
//     from: { email: 'shawlimad93@gmail.com' },
//     content: [{ type: 'text/plain', value: 'You have been invited for an interview.' }],
//   };

//   try {
//     const response = await axios.post(
//       'https://api.sendgrid.com/v3/mail/send',
//       emailData,
//       {
//         headers: {
//           Authorization: `Bearer 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`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (response.status === 202) {
//       console.log('Email sent successfully');
//     } else {
//       console.error('Error sending email:', response.data);
//     }
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// }






    
  
  },
};
</script>

