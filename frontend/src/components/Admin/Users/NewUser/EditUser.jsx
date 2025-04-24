import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditUser = ({ editUser, formData, setFormData, setEditUser, refreshUsers }) => {
  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/newusers/${editUser}`, formData);
      toast.success('User updated successfully');
      setEditUser(null);
      refreshUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleCancel = () => {
    setEditUser(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Update User Infromation</h3>
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleChange}
          />
          <div className="modal-buttons">
            <button type="submit" className="update-btn">
              Update
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
