//DeleteUser.jsx

import React from 'react';
import axios from 'axios';
import './NewUser.css';
import { toast } from 'react-toastify';


const DeleteUser = ({ userId, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
        axios.delete(`http://localhost:5000/api/newusers/${userId}`)
        .then(() => {
          toast.success('User deleted successfully!');
          onDelete();
        })
        .catch(err => {
          console.error('Error deleting user:', err);
          toast.error('Failed to delete user');
        });
    }
  };

  return (
    <button className="delete-btn" onClick={handleDelete}>
      Delete
    </button>
  );
};

export default DeleteUser;
