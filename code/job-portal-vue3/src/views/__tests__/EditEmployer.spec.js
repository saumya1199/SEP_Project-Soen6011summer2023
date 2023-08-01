// EditEmployer.spec.js
import { mount } from '@vue/test-utils';
import EditEmployer from '@/views/EditEmployer.vue';

describe('EditEmployer', () => {
  // Helper function to mount the component with the required props
  const mountComponent = () => {
    return mount(EditEmployer, {
      // Provide any additional props, if needed
    });
  };

  it('should render the form with the input fields', () => {
    const wrapper = mountComponent();

    // Check if the form elements are present
    expect(wrapper.find('input[type="text"][placeholder="Company Name"]').exists()).toBe(true);
    expect(wrapper.find('input[type="text"][placeholder="First Name"]').exists()).toBe(true);
    expect(wrapper.find('input[type="text"][placeholder="Last Name"]').exists()).toBe(true);
    expect(wrapper.find('button.btn-success').exists()).toBe(true);
  });

  it('should update the input values when user types in the fields', async () => {
    const wrapper = mountComponent();

    // Get the input fields and set values
    const companyNameInput = wrapper.find('input[placeholder="Company Name"]');
    const firstNameInput = wrapper.find('input[placeholder="First Name"]');
    const lastNameInput = wrapper.find('input[placeholder="Last Name"]');

    await companyNameInput.setValue('ABC Company');
    await firstNameInput.setValue('John');
    await lastNameInput.setValue('Doe');

    // Check if the values are updated in the component instance
    expect(wrapper.vm.companyName).toBe('ABC Company');
    expect(wrapper.vm.firstName).toBe('John');
    expect(wrapper.vm.lastName).toBe('Doe');
  });

  it('should emit the "saveProfile" event when the "Save" button is clicked', async () => {
    const wrapper = mountComponent();

    // Stub the method to test if it's called when the button is clicked
    jest.spyOn(wrapper.vm, 'saveProfile');

    // Click the "Save" button
    await wrapper.find('button.btn-success').trigger('click');

    // Check if the "saveProfile" method is called
    expect(wrapper.vm.saveProfile).toHaveBeenCalled();
  });

  it('should display the success message after saving the profile', async () => {
    const wrapper = mountComponent();

    // Set input values
    await wrapper.find('input[placeholder="Company Name"]').setValue('ABC Company');
    await wrapper.find('input[placeholder="First Name"]').setValue('John');
    await wrapper.find('input[placeholder="Last Name"]').setValue('Doe');

    // Click the "Save" button
    await wrapper.find('button.btn-success').trigger('click');

    // Check if the success message is displayed
    expect(wrapper.find('.text-success').text()).toBe('Profile successfully saved!');

    // Check if the success message disappears after a few seconds (3000ms)
    await new Promise((resolve) => setTimeout(resolve, 3000));
    expect(wrapper.find('.text-success').exists()).toBe(false);
  });


});
