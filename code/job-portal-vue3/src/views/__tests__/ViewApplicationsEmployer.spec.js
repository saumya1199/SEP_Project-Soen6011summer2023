// ViewApplicationsEmployer.spec.js
import { mount } from '@vue/test-utils';
import ViewApplicationsEmployer from './ViewApplicationsEmployer.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getDownloadURL } from 'firebase/storage';
import { useAuth } from '@vueuse/firebase';
import { fetchMock } from 'jest-fetch-mock';

jest.mock('firebase/auth', () => ({
  __esModule: true,
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  __esModule: true,
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  __esModule: true,
  getDownloadURL: jest.fn(),
}));

jest.mock('@vueuse/firebase', () => ({
  __esModule: true,
  useAuth: jest.fn(),
}));

jest.mock('jest-fetch-mock', () => ({
  __esModule: true,
  fetchMock: jest.fn(() => Promise.resolve({ text: () => JSON.stringify({}) })),
}));

describe('ViewApplicationsEmployer', () => {
  it('fetches applications and job postings on component creation', async () => {
    // Mock useAuth
    useAuth.mockReturnValue({
      user: { email: 'testemployer@example.com' },
    });

    // Mock onAuthStateChanged
    onAuthStateChanged.mockImplementation((_, callback) => {
      callback({ email: 'testemployer@example.com' });
    });

    // Mock Firestore and job postings
    const mockJobPostings = [
      { id: 'job1', Title: 'Job 1', Description: 'Job 1 Description', Status: 'Pending' },
      { id: 'job2', Title: 'Job 2', Description: 'Job 2 Description', Status: 'Approved' },
    ];
    const mockQuerySnapshot = {
      forEach: jest.fn((callback) => {
        mockJobPostings.forEach(callback);
      }),
    };
    getDocs.mockResolvedValueOnce(mockQuerySnapshot);

    // Mock getDownloadURL
    getDownloadURL.mockResolvedValueOnce('https://example.com/resume.pdf');

    // Create a mock router
    const router = createRouter({
      history: createWebHistory(),
      routes: [],
    });

    const wrapper = mount(ViewApplicationsEmployer, {
      global: {
        plugins: [router],
      },
    });

    // Wait for the next tick to ensure all async actions are completed
    await wrapper.vm.$nextTick();

    // Check if the applications and jobPostings data are set correctly
    expect(wrapper.vm.applications).toEqual(mockJobPostings);
    expect(wrapper.vm.jobPostings).toEqual(mockJobPostings);

    // Check if Firestore queries are called with the correct parameters
    expect(collection).toHaveBeenCalledWith(expect.any(Object), 'applications');
    expect(query).toHaveBeenCalledWith(expect.any(Object), where('Employer', '==', 'testemployer@example.com'));
    expect(collection).toHaveBeenCalledWith(expect.any(Object), 'job_postings');
    expect(query).toHaveBeenCalledWith(expect.any(Object));
    expect(getDocs).toHaveBeenCalledTimes(2); // Once for applications, once for job_postings
  });

  it('opens resume in a new tab when "View Resume" button is clicked', async () => {
    // ... (You can write similar tests for other methods and functionalities)
  });

});
