import React, { useState } from 'react';
import './UpdatePassword.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UpdatePassword = () => {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
    toast.error('All fields are required');
    return;
  }

  if (!validatePassword(form.newPassword)) {
    toast.error('New password must have at least 8 characters, 1 uppercase, 1 lowercase & 1 special character.');
    return;
  }

  if (form.newPassword !== form.confirmPassword) {
    toast.error('New password and Confirm password do not match');
    return;
  }

  try {
    const res = await axios.post('https://register-event-cwsv.onrender.com/api/update-password', {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword
    });

    toast.success(res.data.message);
    setForm({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Server error');
    }
  }
};


  return (
    <div className="update-password-container">
      <ToastContainer />
      <form className="password-form" onSubmit={handleSubmit}>
        <h2>Update Password</h2>
        <div className="form-group">
          <label>Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            placeholder="Enter old password"
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
          />
        </div>
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default UpdatePassword;
