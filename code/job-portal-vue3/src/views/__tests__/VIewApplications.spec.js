// ViewApplications.spec.js
import { mount } from '@vue/test-utils';
import ViewApplications from '@/views/ViewApplications.vue';

describe('ViewApplications', () => {
  // Helper function to mount the component with the required props
  const mountComponent = () => {
    return mount(ViewApplications, {
      // Provide any additional props, if needed
    });
  };

  it('should render job applications correctly', async () => {
    const applications = [
      {
        id: 'application1',
        Title: 'Job 1 Title',
        Description: 'Job 1 Description',
        Status: 'Pending',
      },
      {
        id: 'application2',
        Title: 'Job 2 Title',
        Description: 'Job 2 Description',
        Status: 'Approved',
      },
    ];

    // Mount the component with the provided applications
    const wrapper = mountComponent();
    wrapper.setData({ applications });

    // Check if the job applications are rendered correctly
    const applicationElements = wrapper.findAll('.card');
    expect(applicationElements.length).toBe(2);

    // Check the content of the first application
    expect(applicationElements[0].find('.card-title').text()).toBe('Job 1 Title');
    expect(applicationElements[0].find('.card-text').text()).toBe('Job 1 Description');
    expect(applicationElements[0].find('.fw-bold').text()).toBe('Pending');

    // Check the content of the second application
    expect(applicationElements[1].find('.card-title').text()).toBe('Job 2 Title');
    expect(applicationElements[1].find('.card-text').text()).toBe('Job 2 Description');
    expect(applicationElements[1].find('.fw-bold').text()).toBe('Approved');
  });

  it('should display "No applications available." if there are no applications', async () => {
    // Mount the component with an empty applications array
    const wrapper = mountComponent();
    wrapper.setData({ applications: [] });

    // Check if the "No applications available." message is displayed
    expect(wrapper.find('div').text()).toBe('No applications available.');
  });

  it('should call deleteApplication method when "Remove" button is clicked', async () => {
    const applications = [
      {
        id: 'application1',
        Title: 'Job 1 Title',
        Description: 'Job 1 Description',
        Status: 'Pending',
      },
    ];

    // Mount the component with the provided applications
    const wrapper = mountComponent();
    wrapper.setData({ applications });

    // Mock the deleteApplication method
    const deleteApplicationMock = jest.fn();
    wrapper.vm.deleteApplication = deleteApplicationMock;

    // Find the "Remove" button and click it
    const removeButton = wrapper.find('button.btn-danger');
    removeButton.trigger('click');

    // Check if the deleteApplication method was called with the correct application ID
    expect(deleteApplicationMock).toHaveBeenCalledWith('application1');
  });

  
});
