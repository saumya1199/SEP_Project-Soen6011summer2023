<template>
  <div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Title</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control is-expanded has-icons-left">
            <input class="input" type="text" placeholder="Job Title" v-model="title">
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Description</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea class="textarea" placeholder="Enter job description" v-model="description"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label">
        <!-- Left empty for spacing -->
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <button class="button is-primary" v-on:click="saveJobPosting">
              Add Job
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="jobPostings.length > 0">
      <h2 class="title is-4">Job Postings</h2>      
        <div v-for="posting in jobPostings" :key="posting.id" class="card mb-1">          
            <div class="card-content">
              <div class="content">   
                <div class="columns is-mobile is-vcentered">    
                  <div class="column"> 
                    <p class="card-header-title">{{ posting.title }}</p>            
                    {{ posting.description }}
                  </div>
                    <div class="column is-5 has-text-right">
                      <button class="button is-danger" v-on:click="deleteJobPosting(posting.id)">
                        Delete
                      </button>                    
                  </div> 
                </div>  
              </div>
            </div>          
        </div>      
    </div>

  </div>
</template>


<script>
import { ref } from 'vue'
import { db } from '@/main'
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs, query, where } from "firebase/firestore"
import { getAuth } from "firebase/auth";

export default {
  name: 'AddJob',
  data() {
    return {
      title: '',
      description: '',
      jobPostings: [],
      auth: null
    }
  },
  created() {
    // Get the user object from the promise returned by getAuth()
    this.auth = getAuth();
    this.getJobPostings();
  },

  methods: {
    async saveJobPosting() {
  if (!this.title || !this.description) {
    alert('Please enter a title and description.')
    return
  }
  
  const docRef = await addDoc(collection(db, 'job_postings'), {
    title: this.title,
    description: this.description,
    author: this.auth.currentUser.email
  })
  console.log('Document written with ID: ', docRef.id)
  this.title = ''
  this.description = ''
  this.getJobPostings()
},


    async getJobPostings() {
      const postings = []
      const q = query(collection(db, 'job_postings'), where('author', '==', this.auth.currentUser.email))
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        postings.push({ id: doc.id, ...doc.data() })
      })
      this.jobPostings = postings
    },
    async deleteJobPosting(id) {
  // Delete document in 'job_postings' collection
  await deleteDoc(doc(db, "job_postings", id))

// Delete document in 'applications' collection
const q = query(collection(db, 'applications'), where('JobPostingId', '==', id))
const querySnapshot = await getDocs(q)
querySnapshot.forEach(async (appDoc) => {
  await deleteDoc(doc(db, 'applications', appDoc.id))
})

this.getJobPostings()

    }
  }
}
</script>

