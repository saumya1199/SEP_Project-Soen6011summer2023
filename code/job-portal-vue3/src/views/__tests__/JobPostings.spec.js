// JobPostings.spec.js
import { mount } from '@vue/test-utils';
import JobPostings from '@/views/JobPostings.vue';

describe('JobPostings', () => {
  // Helper function to mount the component with the required props
  const mountComponent = () => {
    return mount(JobPostings, {
      // Provide any additional props, if needed
    });
  };

  it('should render job postings correctly', async () => {
    const jobPostings = [
      {
        id: 'job1',
        title: 'Job 1 Title',
        description: 'Job 1 Description',
      },
      {
        id: 'job2',
        title: 'Job 2 Title',
        description: 'Job 2 Description',
      },
    ];

    // Mount the component with the provided job postings
    const wrapper = mountComponent();
    wrapper.setData({ jobPostings });

    // Check if the job postings are rendered correctly
    const jobPostingElements = wrapper.findAll('.job-posting');
    expect(jobPostingElements.length).toBe(2);

    // Check the content of the first job posting
    expect(jobPostingElements[0].find('.card-title').text()).toBe('Job 1 Title');
    expect(jobPostingElements[0].find('.card-text').text()).toBe('Job 1 Description');

    // Check the content of the second job posting
    expect(jobPostingElements[1].find('.card-title').text()).toBe('Job 2 Title');
    expect(jobPostingElements[1].find('.card-text').text()).toBe('Job 2 Description');
  });

  it('should display "No job postings available." if there are no job postings', async () => {
    // Mount the component with an empty job postings array
    const wrapper = mountComponent();
    wrapper.setData({ jobPostings: [] });

    // Check if the "No job postings available." message is displayed
    expect(wrapper.find('div').text()).toBe('No job postings available.');
  });

  it('should display "Apply" button for job postings user has not applied to', async () => {
    const jobPostings = [
      {
        id: 'job1',
        title: 'Job 1 Title',
        description: 'Job 1 Description',
      },
      {
        id: 'job2',
        title: 'Job 2 Title',
        description: 'Job 2 Description',
      },
    ];

    // Mount the component with the provided job postings
    const wrapper = mountComponent();
    wrapper.setData({ jobPostings, appliedJobs: [] });

    // Check if the "Apply" button is displayed for both job postings
    const applyButtons = wrapper.findAll('button.btn-success');
    expect(applyButtons.length).toBe(2);
    expect(applyButtons[0].text()).toBe('Apply');
    expect(applyButtons[1].text()).toBe('Apply');
  });

  it('should display "Applied" button for job postings user has applied to', async () => {
    const jobPostings = [
      {
        id: 'job1',
        title: 'Job 1 Title',
        description: 'Job 1 Description',
      },
      {
        id: 'job2',
        title: 'Job 2 Title',
        description: 'Job 2 Description',
      },
    ];

    // Mount the component with the provided job postings
    const wrapper = mountComponent();
    wrapper.setData({ jobPostings, appliedJobs: ['job1'] });

    // Check if the "Applied" button is displayed for the first job posting
    const appliedButton = wrapper.find('button.btn-secondary');
    expect(appliedButton.exists()).toBe(true);
    expect(appliedButton.text()).toBe('Applied');

    // Check if the "Apply" button is displayed for the second job posting
    const applyButton = wrapper.find('button.btn-success');
    expect(applyButton.exists()).toBe(true);
    expect(applyButton.text()).toBe('Apply');
  });


});
