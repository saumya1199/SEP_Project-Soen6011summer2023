// Register.spec.js
import { mount } from '@vue/test-utils';
import Register from './Register.vue';
import { ref } from 'vue';

// Mock the firebase functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ createUserWithEmailAndPassword: jest.fn() })),
}));

jest.mock('@/main', () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(),
    })),
  },
}));

describe('Register', () => {
  it('renders the register form', () => {
    const wrapper = mount(Register);
    expect(wrapper.exists()).toBe(true);

    // Check if the necessary elements are present in the form
    expect(wrapper.find('input[type="email"][placeholder="Email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"][placeholder="Password"]').exists()).toBe(true);
    expect(wrapper.find('button').text()).toBe('Register as Employer');
    expect(wrapper.find('button').text()).toBe('Register as Candidate');
  });

  it('sets the email and password correctly', async () => {
    const wrapper = mount(Register);

    // Set the email and password input values
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('testpassword');

    // Check if the values are correctly set in the component's data
    expect(wrapper.vm.email).toBe('test@example.com');
    expect(wrapper.vm.password).toBe('testpassword');
  });

  it('calls registerEMP when "Register as Employer" button is clicked', async () => {
    const wrapper = mount(Register);

    // Set the email and password input values
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('testpassword');

    // Mock the registerEMP function to avoid actual Firebase-related errors in the test
    wrapper.vm.registerEMP = jest.fn();

    // Simulate the click on the "Register as Employer" button
    await wrapper.find('button:nth-of-type(1)').trigger('click');

    // Check if the registerEMP function is called
    expect(wrapper.vm.registerEMP).toHaveBeenCalled();
  });

  it('calls registerCAN when "Register as Candidate" button is clicked', async () => {
    const wrapper = mount(Register);

    // Set the email and password input values
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('testpassword');

    // Mock the registerCAN function to avoid actual Firebase-related errors in the test
    wrapper.vm.registerCAN = jest.fn();

    // Simulate the click on the "Register as Candidate" button
    await wrapper.find('button:nth-of-type(2)').trigger('click');

    // Check if the registerCAN function is called
    expect(wrapper.vm.registerCAN).toHaveBeenCalled();
  });

  // You can write additional tests to cover other scenarios and error cases
});
