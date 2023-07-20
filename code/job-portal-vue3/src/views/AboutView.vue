<template>
  <div class="about-page">
    <h1>{{ pageTitle }}</h1>
    <p>{{ welcomeText }}</p>

    <h2>{{ jobSeekersHeading }}</h2>
    <p>{{ jobSeekersContent }}</p>

    <h2>{{ employersHeading }}</h2>
    <p>{{ employersContent }}</p>

    <h2>{{ whyChooseHeading }}</h2>
    <ol>
      <li v-for="reason in whyChooseReasons" :key="reason">{{ reason }}</li>
    </ol>

    <p>{{ missionStatement }}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageTitle: 'About Quick Jobs',
      welcomeText: 'Welcome to Quick JObs, a revolutionary online platform dedicated to connecting job seekers with employers, empowering individuals to find meaningful employment opportunities. With our user-friendly interface and comprehensive features, we aim to bridge the gap between job seekers and job providers, fostering a thriving job market for everyone.',
      jobSeekersHeading: 'For Job Seekers:',
      jobSeekersContent: 'Whether you are a fresh graduate embarking on your professional journey or an experienced professional seeking new horizons, Quick Jobs Portal is your go-to platform for discovering exciting career opportunities. We offer a vast array of job listings across diverse industries and sectors, catering to a wide range of skills and qualifications. Our intuitive search and filtering options enable you to find the perfect job that matches your aspirations, qualifications, and location. Create your professional profile, upload your resume, and showcase your skills to grab the attention of top employers. With Quick Jobs Portal, your dream job is just a click away.',
      employersHeading: 'For Employers:',
      employersContent: 'Finding the right talent for your organization is crucial for growth and success. Quick Jobs Portal provides you with a powerful platform to streamline your recruitment process and connect with a pool of highly qualified candidates. Post your job openings, specify your requirements, and let our advanced matching algorithms do the work for you. Our applicant tracking system allows you to manage and review applications efficiently, ensuring you make informed hiring decisions. With Quick Jobs Portal, you can tap into a vast talent pool and discover exceptional professionals who can contribute to your company\'s objectives.',
      whyChooseHeading: 'Why Choose Quick Jobs Portal?',
      whyChooseReasons: [
        'Extensive Job Listings: Our platform hosts a diverse range of job opportunities, ensuring a broad spectrum of choices for job seekers and a wide talent pool for employers.',
        'Intuitive User Experience: We prioritize user experience, offering a clean and intuitive interface that makes job search and recruitment hassle-free.',
        'Advanced Matching Algorithms: Our intelligent algorithms match job seekers with relevant job openings, enhancing the chances of finding the perfect fit.',
        'Efficient Applicant Tracking: Employers can efficiently manage and review applications through our applicant tracking system, saving time and resources.',
        'Customized Job Alerts: Stay updated with the latest job openings that match your preferences through personalized job alerts, ensuring you never miss an opportunity.'
      ],
      missionStatement: 'At Quick Jobs Portal, we are committed to revolutionizing the job search landscape by empowering job seekers and simplifying the recruitment process for employers. Join us today and unlock endless possibilities for your career or your organization\'s growth. Together, let\'s build a brighter future where talent meets opportunity.'
    }
  }
}
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 28px;
  color: #000; /* Updated color to black */
  margin-bottom: 10px;
}

h2 {
  font-size: 22px;
  color: #000; /* Updated color to black */
  margin-top: 20px;
  margin-bottom: 10px;
}

p {
  color: #000; /* Updated color to black */
  line-height: 1.5;
}

ol {
  color: #000; /* Updated color to black */
  padding-left: 20px;
}

li {
  margin-bottom: 5px;
}
</style>