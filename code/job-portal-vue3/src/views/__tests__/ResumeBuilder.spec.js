// ResumeBuilder.spec.js
import { mount } from '@vue/test-utils';
import ResumeBuilder from './ResumeBuilder.vue';
import jsPDF from 'jspdf';

jest.mock('jspdf', () => ({
  __esModule: true,
  default: {
    setFontSize: jest.fn(),
    text: jest.fn(),
    output: jest.fn(),
  },
}));

describe('ResumeBuilder', () => {
  it('renders the resume builder form', () => {
    const wrapper = mount(ResumeBuilder);
    expect(wrapper.exists()).toBe(true);

    // Check if the necessary elements are present in the form
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="text"][id="name"]').exists()).toBe(true);
    expect(wrapper.find('input[type="email"][id="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="tel"][id="phone"]').exists()).toBe(true);
    expect(wrapper.find('button[type="button"]').exists()).toBe(true);
    expect(wrapper.find('button[type="button"]').text()).toBe('Add Education');
    expect(wrapper.find('button[type="button"]').text()).toBe('Submit');
  });

  it('adds and removes education sections', async () => {
    const wrapper = mount(ResumeBuilder);

    // Initial education section count should be 1
    expect(wrapper.findAll('.education-section')).toHaveLength(1);

    // Click "Add Education" button
    await wrapper.find('button[type="button"]').trigger('click');

    // After clicking "Add Education" button, the education section count should be 2
    expect(wrapper.findAll('.education-section')).toHaveLength(2);

    // Click "Remove" button on the first education section
    await wrapper.find('.education-section button[type="button"]').trigger('click');

    // After clicking "Remove" button, the education section count should be back to 1
    expect(wrapper.findAll('.education-section')).toHaveLength(1);
  });

  it('generates and uploads a PDF when "Submit" button is clicked', async () => {
    const wrapper = mount(ResumeBuilder);

    // Mock the generatePDF function to avoid actual PDF generation
    wrapper.vm.generatePDF = jest.fn(() => new jsPDF());

    // Set some input values
    await wrapper.find('input[type="text"][id="name"]').setValue('John Doe');
    await wrapper.find('input[type="email"][id="email"]').setValue('john@example.com');
    await wrapper.find('input[type="tel"][id="phone"]').setValue('1234567890');

    // Click "Submit" button
    await wrapper.find('button[type="button"]').trigger('click');

    // Check if the generatePDF function is called with the correct resume data
    expect(wrapper.vm.generatePDF).toHaveBeenCalledWith(wrapper.vm.resume);

    // Check if the resume upload success message is displayed
    expect(wrapper.find('.alert.alert-success').exists()).toBe(true);
  });

  
});
