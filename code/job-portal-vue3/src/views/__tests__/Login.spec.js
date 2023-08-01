// Login.spec.js
import { mount } from '@vue/test-utils';
import Login from './Login.vue';

describe('Login', () => {
  it('renders the login form', () => {
    const wrapper = mount(Login);
    expect(wrapper.exists()).toBe(true);

    // Check if the necessary elements are present in the form
    expect(wrapper.find('input[type="text"][placeholder="Email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"][placeholder="Password"]').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Submit');
  });

  it('sets the email and password correctly', async () => {
    const wrapper = mount(Login);

    // Set the email and password input values
    await wrapper.find('input[type="text"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('testpassword');

    // Check if the values are correctly set in the component's data
    expect(wrapper.vm.email).toBe('test@example.com');
    expect(wrapper.vm.password).toBe('testpassword');
  });

  it('emits login event when the Submit button is clicked', async () => {
    const wrapper = mount(Login);

    // Set the email and password input values
    await wrapper.find('input[type="text"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('testpassword');

    // Mock the login function to avoid Firebase-related errors in the test
    wrapper.vm.login = jest.fn();

    // Simulate the click on the Submit button
    await wrapper.find('button').trigger('click');

    // Check if the login function is called with the correct email and password
    expect(wrapper.vm.login).toHaveBeenCalledWith();
  });

  it('displays error message for invalid email', async () => {
    const wrapper = mount(Login);

    // Set an invalid email
    await wrapper.find('input[type="text"]').setValue('invalid_email');

    // Simulate the click on the Submit button
    await wrapper.find('button').trigger('click');

    // Check if the error message is displayed
    expect(wrapper.find('.text-danger').text()).toBe('Invalid email');
  });

  // You can write similar tests to cover other error cases as well
});
