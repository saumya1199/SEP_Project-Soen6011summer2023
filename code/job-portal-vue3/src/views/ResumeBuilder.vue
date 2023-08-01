<template>
    <div class="resume-builder">
      <h2 class="title h2 text-center">Resume Builder</h2>
      <form @submit.prevent="submitResume">
        <div class="form-group">
          <label for="name" class="form-label">Name:</label>
          <input type="text" id="name" v-model="resume.name" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="email" class="form-label">Email:</label>
          <input type="email" id="email" v-model="resume.email" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="phone" class="form-label">Phone:</label>
          <input type="tel" id="phone" v-model="resume.phone" class="form-control" required />
        </div>
        <div class="form-group">
          <h3 class="title h3">Education</h3>
          <div v-for="(edu, index) in resume.education" :key="index" class="education-section">
            <input type="text" v-model="edu.school" placeholder="School/University" class="form-control" required />
            <input type="text" v-model="edu.degree" placeholder="Degree" class="form-control" required />
            <div class="year-field">
              <input type="text" v-model="edu.year" placeholder="Year" class="form-control" required />
              <button type="button" @click="removeEducation(index)" class="btn btn-danger">Remove</button>
            </div>
          </div>
        </div>
        <div class="button-group">
          <button type="button" @click="addEducation" class="btn btn-primary">Add Education</button>
          <button type="button" @click="generateAndUploadPDF" class="btn btn-black">Submit</button>
        </div>
      </form>
  
      <!-- Display success message -->
      <div v-if="isUploadSuccess" class="alert alert-success text-center mt-4">
        Resume uploaded successfully!
      </div>
  
      <!-- Display error message -->
      <div v-if="isUploadError" class="alert alert-danger text-center mt-4">
        Error uploading the resume. Please try again later.
      </div>
  
      <h2 class="title h2 text-center" style="margin-top: 20px;">Preview</h2>
      <div class="resume-preview">
        <p><strong>Name:</strong> {{ resume.name }}</p>
        <p><strong>Email:</strong> {{ resume.email }}</p>
        <p><strong>Phone:</strong> {{ resume.phone }}</p>
        <h3 class="title h3">Education</h3>
        <div v-for="(edu, index) in resume.education" :key="index">
          <p><strong>School/University:</strong> {{ edu.school }}</p>
          <p><strong>Degree:</strong> {{ edu.degree }}</p>
          <p><strong>Year:</strong> {{ edu.year }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getStorage, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
  import { getAuth } from 'firebase/auth';
  import jsPDF from 'jspdf';
  
  export default {
    data() {
      return {
        resume: {
          name: '',
          email: '',
          phone: '',
          education: [
            { school: '', degree: '', year: '' }
          ]
        },
        auth: null,
        storage: null,
        showProgressBar: false,
        progress: 0,
        isUploadSuccess: false,
        isUploadError: false
      };
    },
    created() {
      this.auth = getAuth();
      this.storage = getStorage();
    },
    methods: {
      addEducation() {
        this.resume.education.push({ school: '', degree: '', year: '' });
      },
      removeEducation(index) {
        this.resume.education.splice(index, 1);
      },
      async generateAndUploadPDF() {
        const resumeData = this.resume;
        const pdf = this.generatePDF(resumeData);
  
        const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
  
        const storagePath = `resumes/${this.auth.currentUser.email}/resume.pdf`;
        const resumeRef = storageRef(this.storage, storagePath);
        const uploadTask = uploadBytesResumable(resumeRef, pdfBlob);
  
        this.showProgressBar = true;
        this.progress = 0;
  
        try {
          await uploadTask;
  
          // Resume upload complete
          console.log('Resume upload complete');
  
          // Hide the progress bar after upload completion
          this.showProgressBar = false;
  
          // Display a success message
          this.isUploadSuccess = true;
          setTimeout(() => {
            this.isUploadSuccess = false;
          }, 3000);
  
          // Reset the resume form after successful upload
          this.resetResumeForm();
        } catch (error) {
          console.error('Error uploading resume:', error);
          // Hide the progress bar on error
          this.showProgressBar = false;
  
          // Display an error message
          this.isUploadError = true;
          setTimeout(() => {
            this.isUploadError = false;
          }, 5000);
        }
      },
  
      generatePDF(resumeData) {
        const doc = new jsPDF();
  
        doc.setFontSize(18);
        doc.text(resumeData.name, 20, 20);
        doc.setFontSize(12);
        doc.text(`Email: ${resumeData.email}`, 20, 30);
        doc.text(`Phone: ${resumeData.phone}`, 20, 40);
  
        doc.setFontSize(16);
        doc.text('Education', 20, 60);
        let yOffset = 70;
        for (const edu of resumeData.education) {
          doc.setFontSize(12);
          doc.text(`School/University: ${edu.school}`, 20, yOffset);
          doc.text(`Degree: ${edu.degree}`, 20, yOffset + 10);
          doc.text(`Year: ${edu.year}`, 20, yOffset + 20);
          yOffset += 30;
        }
  
        return doc;
      },
  
      resetResumeForm() {
        // Reset the resume data to empty values
        this.resume = {
          name: '',
          email: '',
          phone: '',
          education: [{ school: '', degree: '', year: '' }]
        };
      },
    },
  };
  </script>
  
  
  
  
  
  <style scoped>
  .resume-builder {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-label {
    font-weight: bold;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: #fff;
  }
  
  .btn-danger {
    background-color: #dc3545;
    color: #fff;
  }
  
  .btn-black {
    background-color: #000;
    color: #fff;
  }
  
  .btn:hover {
    opacity: 0.8;
  }
  
  .resume-preview {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .title {
    text-align: center;
  }
  
  .h2 {
    font-size: 24px;
  }
  
  .h3 {
    font-size: 20px;
  }
  
  /* Additional styling for proper spacing */
  .year-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .education-section {
    margin-bottom: 20px;
  }
  </style>
  