// AdminDashboard.spec.js
import { mount } from '@vue/test-utils';
import AdminDashboard from '@/views/AdminDashboard.vue';

describe('AdminDashboard', () => {
  // Helper function to mount the component with the required props
  const mountComponent = () => {
    return mount(AdminDashboard, {
      // Provide any additional props, if needed
    });
  };

  it('should render candidate profiles correctly', async () => {
    const candidateProfiles = [
      { email: 'candidate1@example.com', first_name: 'John', last_name: 'Doe' },
      { email: 'candidate2@example.com', first_name: 'Jane', last_name: 'Smith' },
    ];

    // Mount the component with the provided candidate profiles
    const wrapper = mountComponent();
    wrapper.setData({ candidateProfiles });

    // Check if the candidate profiles are rendered correctly
    const candidateProfileCards = wrapper.findAll('.candidate-profile-card');
    expect(candidateProfileCards.length).toBe(2);

    // Check the content of the first candidate profile
    expect(candidateProfileCards[0].find('.candidate-email').text()).toBe('Candidate email: candidate1@example.com');
    expect(candidateProfileCards[0].find('.candidate-first-name').text()).toBe('First Name: John');
    expect(candidateProfileCards[0].find('.candidate-last-name').text()).toBe('Last Name: Doe');

    // Check the content of the second candidate profile
    expect(candidateProfileCards[1].find('.candidate-email').text()).toBe('Candidate email: candidate2@example.com');
    expect(candidateProfileCards[1].find('.candidate-first-name').text()).toBe('First Name: Jane');
    expect(candidateProfileCards[1].find('.candidate-last-name').text()).toBe('Last Name: Smith');
  });

  it('should render employer profiles correctly', async () => {
    const employerProfiles = [
      { company_name: 'Company A', first_name: 'John', last_name: 'Doe' },
      { company_name: 'Company B', first_name: 'Jane', last_name: 'Smith' },
    ];

    // Mount the component with the provided employer profiles
    const wrapper = mountComponent();
    wrapper.setData({ employerProfiles });

    // Check if the employer profiles are rendered correctly
    const employerProfileCards = wrapper.findAll('.employer-profile-card');
    expect(employerProfileCards.length).toBe(2);

    // Check the content of the first employer profile
    expect(employerProfileCards[0].find('.employer-email').text()).toBe('Employer Company: Company A');
    expect(employerProfileCards[0].find('.employer-first-name').text()).toBe('First Name: John');
    expect(employerProfileCards[0].find('.employer-last-name').text()).toBe('Last Name: Doe');

    // Check the content of the second employer profile
    expect(employerProfileCards[1].find('.employer-email').text()).toBe('Employer Company: Company B');
    expect(employerProfileCards[1].find('.employer-first-name').text()).toBe('First Name: Jane');
    expect(employerProfileCards[1].find('.employer-last-name').text()).toBe('Last Name: Smith');
  });

  it('should render job postings correctly', async () => {
    const jobPostings = [
      { id: 'job1', title: 'Job 1 Title', description: 'Job 1 Description' },
      { id: 'job2', title: 'Job 2 Title', description: 'Job 2 Description' },
    ];

    // Mount the component with the provided job postings
    const wrapper = mountComponent();
    wrapper.setData({ jobPostings });

    // Check if the job postings are rendered correctly
    const jobPostingCards = wrapper.findAll('.job-posting-card');
    expect(jobPostingCards.length).toBe(2);

    // Check the content of the first job posting
    expect(jobPostingCards[0].find('.job-title').text()).toBe('Job 1 Title');
    expect(jobPostingCards[0].find('.job-description').text()).toBe('Job 1 Description');

    // Check the content of the second job posting
    expect(jobPostingCards[1].find('.job-title').text()).toBe('Job 2 Title');
    expect(jobPostingCards[1].find('.job-description').text()).toBe('Job 2 Description');
  });

  it('should render job applications correctly', async () => {
    const applications = [
      { id: 'app1', Candidate: 'candidate1@example.com', Title: 'Job 1 Title', Status: 'Pending' },
      { id: 'app2', Candidate: 'candidate2@example.com', Title: 'Job 2 Title', Status: 'Approved' },
    ];

    // Mount the component with the provided applications
    const wrapper = mountComponent();
    wrapper.setData({ applications });

    // Check if the job applications are rendered correctly
    const applicationCards = wrapper.findAll('.application-card');
    expect(applicationCards.length).toBe(2);

    // Check the content of the first job application
    expect(applicationCards[0].find('.applicant-email').text()).toBe('Applicant email: candidate1@example.com');
    expect(applicationCards[0].find('.job-title').text()).toBe('Job Title: Job 1 Title');
    expect(applicationCards[0].find('.application-status').text()).toBe('Status: Pending');

    // Check the content of the second job application
    expect(applicationCards[1].find('.applicant-email').text()).toBe('Applicant email: candidate2@example.com');
    expect(applicationCards[1].find('.job-title').text()).toBe('Job Title: Job 2 Title');
    expect(applicationCards[1].find('.application-status').text()).toBe('Status: Approved');
  });

  
});
