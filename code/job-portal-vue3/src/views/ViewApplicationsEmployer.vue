<template>  
    <div v-if="applications.length > 0">
        <h2 class="title is-4">Applications</h2>      
          <div v-for="posting in applications" :key="posting.id" class="card mb-1">          
              <div class="card-content">
                <div class="content">   
                  <div class="columns is-mobile is-vcentered">    
                    <div class="column">
                        <div>
                            Candidate email: {{ posting.Candidate }}
                        </div> 
                        <div>
                           Resume: {{ posting.Resume }}
                        </div>
                      <p class="card-header-title">{{  posting.Title }}</p> 
                      {{ posting.Description }}
                      </div>                   
                      <div class="column is-5 has-text-right">
                        {{ posting.Status }}
                        <button v-if="posting.Status=='Pending'" class="button is-danger" v-on:click="DenyApplication(posting.id)">
                          Deny
                        </button> 
                        <button v-if="posting.Status=='Pending'" class="button is-success" v-on:click="ApproveApplication(posting.id)">
                          Approve
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
  import { updateDoc, collection, addDoc, getDocs, query, where, deleteDoc, doc, getDoc } from 'firebase/firestore'
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
        , where('Employer', '==', this.auth.currentUser.email)
        )
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          postings.push({ id: doc.id, ...doc.data() })
        })
        this.applications = postings

      },

      async DenyApplication(postingId) {

        const docRef = doc(db, "applications", postingId);
            await updateDoc(docRef,{
                "Status": 'Denied'
        })

        alert('Application denied successfully!');
        location.reload();
  },
        async ApproveApplication(postingId) {

            const docRef = doc(db, "applications", postingId);
            await updateDoc(docRef,{
          "Status": 'Approved'
        })

        alert('Application approved successfully! '+postingId);
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
  