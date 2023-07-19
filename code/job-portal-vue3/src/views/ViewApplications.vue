<template>  
    <div v-if="applications.length > 0">
        <h2 class="title is-4">Job Postings</h2>      
          <div v-for="posting in applications" :key="posting.id" class="card mb-1">          
              <div class="card-content">
                <div class="content">   
                  <div class="columns is-mobile is-vcentered">    
                    <div class="column"> 
                      <p class="card-header-title">{{  posting.Title }}</p>            
                      {{ posting.Description }}
                      </div>                   
                      <div class="column is-5 has-text-right">                       
                          {{ posting.Status }}                                         
                        <button v-if="posting.Status=='Pending'" class="button is-danger" v-on:click="DeleteApplication(posting.id)">
                          Remove
                        </button>                    
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
  import { collection, addDoc, getDocs, query, where, deleteDoc, doc, getDoc } from 'firebase/firestore'
  import { getAuth, reload } from "firebase/auth";
  
  export default {
    
    name: 'ViewApplication',
    data() {

      return {
        title: '',
        description: '',
        applications: [],
        jobPostings: [],
        auth: null
      }
    },
    created() {

      // Get the user object from the promise returned by getAuth()
      this.auth = getAuth();
      this.getApplcations();
      this.getJobPostings();
    },
  
    methods: {  

        // showTitle(Id){
        //     foreach (job in this.jobPostings){
        //         if(Id == job.id){
        //             return job.title;
        //         }
        //     }

        // },

        async getJobPostings() {
        const postings = []
        const q = query(collection(db, 'job_postings')
       // , where('author', '==', this.auth.currentUser.email)
        )
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          postings.push({ id: doc.id, ...doc.data() })
        })
        this.jobPostings = postings
      },
        

      async getApplcations() {
        const postings = []
        const q = query(collection(db, 'applications')
        , where('Candidate', '==', this.auth.currentUser.email)
        )
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          postings.push({ id: doc.id, ...doc.data() })
        })
        this.applications = postings

      },

      async DeleteApplication(postingId) {

         await deleteDoc(doc(db,"applications",postingId));

        alert('Application deleted successfully!');
        location.reload();
  }
    }
  }
  </script>
  
  <style scoped>
  .job-posting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .delete-button {
    margin-left: 10px;
  }
  </style>
  