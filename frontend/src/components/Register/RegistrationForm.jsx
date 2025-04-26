// src/components/RegistrationForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    contact: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Enter a valid 10-digit number';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error('❌ Please fix the errors in the form.');
    } else {
      try {
        const response = await fetch('https://register-event-cwsv.onrender.com/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success('✅ Form submitted successfully!');
          console.log('✅ Server Response:', data);
          setFormData({
            fullName: '',
            email: '',
            company: '',
            contact: ''
          });
        } else {
          console.error('❌ Error:', data);
          toast.error('❌ Submission failed. Please try again.');
        }
      } catch (error) {
        console.error('❌ Network or server error:', error);
        toast.error('❌ Submission failed. Please try again.');
      }
    }
  };

  return (
    <div className="registration-wrapper">
      <div className="container">
        <div className="form-box">
          <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
          <h2 className="registration-title">User Registration</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="error">{errors.fullName}</p>}

            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}

            <label className="form-label">Company Name</label>
            <input
              className="form-input"
              type="text"
              name="company"
              placeholder="Enter your company name"
              value={formData.company}
              onChange={handleChange}
            />
            {errors.company && <p className="error">{errors.company}</p>}

            <label className="form-label">Contact No.</label>
            <input
              className="form-input"
              type="tel"
              name="contact"
              placeholder="Enter contact number"
              value={formData.contact}
              onChange={handleChange}
            />
            {errors.contact && <p className="error">{errors.contact}</p>}

            <button type="submit" className="submit-btn">Submit</button>

          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RegistrationForm;