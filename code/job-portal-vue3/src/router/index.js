import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/addjob',
      name: 'AddJob',
      component: () => import('../views/AddJob.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/jobs',
      name: 'JobPostings',
      component: () => import('../views/JobPostings.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/applications',
      name: 'ViewApplications',
      component: () => import('../views/ViewApplications.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/editEmployer',
      name: 'EditEmployer',
      component: () => import('../views/EditEmployer.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/editCandidate',
      name: 'EditCandidate',
      component: () => import('../views/EditCandidate.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/applicationsEmployer',
      name: 'ViewApplicationsEmployer',
      component: () => import('../views/ViewApplicationsEmployer.vue'),
      meta: {
        requiresAuth: true,
      }
    }
  ]
})

//This ensures the page will wait until it can get the current user before loading the page
const getCurrentUser = () =>{
return new Promise((resolve, reject) =>{
const removeListener = onAuthStateChanged(
  getAuth(),
  (user) =>{
    removeListener();
    resolve(user);
  },
  reject
)

});

};

//Code to restrict which pages can be accessed by which users
router.beforeEach(async(to, from, next) =>{
if(to.matched.some((record) => record.meta.requiresAuth)){
  if(await getCurrentUser()){
    next();
  } else{
    alert("you dont have access!");
    next("/login");
  }
}else{
  next();
}

});

export default router
