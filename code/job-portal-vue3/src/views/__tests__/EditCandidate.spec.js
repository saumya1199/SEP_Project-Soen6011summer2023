// EditCandidate.spec.js
import { mount } from '@vue/test-utils';
import EditCandidate from '@/views/EditCandidate.vue';

describe('EditCandidate', () => {
  // Helper function to mount the component with the required props
  const mountComponent = () => {
    return mount(EditCandidate, {
      // Provide any additional props, if needed
    });
  };

  it('should render the form with the input fields', () => {
    const wrapper = mountComponent();

    // Check if the form elements are present
    expect(wrapper.find('input[type="text"][placeholder="First Name"]').exists()).toBe(true);
    expect(wrapper.find('input[type="text"][placeholder="Last Name"]').exists()).toBe(true);
    expect(wrapper.find('input[type="text"][placeholder="Email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="file"]').exists()).toBe(true);
    expect(wrapper.find('button.btn-primary').exists()).toBe(true);
  });

  it('should update the input values when user types in the fields', async () => {
    const wrapper = mountComponent();

    // Get the input fields and set values
    const firstNameInput = wrapper.find('input[placeholder="First Name"]');
    const lastNameInput = wrapper.find('input[placeholder="Last Name"]');
    const emailInput = wrapper.find('input[placeholder="Email"]');

    await firstNameInput.setValue('John');
    await lastNameInput.setValue('Doe');
    await emailInput.setValue('john.doe@example.com');

    // Check if the values are updated in the component instance
    expect(wrapper.vm.firstName).toBe('John');
    expect(wrapper.vm.lastName).toBe('Doe');
    expect(wrapper.vm.email).toBe('john.doe@example.com');
  });

  it('should emit the "saveProfile" event when the "Save" button is clicked', async () => {
    const wrapper = mountComponent();

    // Stub the method to test if it's called when the button is clicked
    jest.spyOn(wrapper.vm, 'saveProfile');

    // Click the "Save" button
    await wrapper.find('button.btn-primary').trigger('click');

    // Check if the "saveProfile" method is called
    expect(wrapper.vm.saveProfile).toHaveBeenCalled();
  });

});
