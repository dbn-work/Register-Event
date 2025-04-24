//NewUser.jsx
import React, { useEffect, useState } from 'react';
import './NewUser.css';
import axios from 'axios';
import EditUser from './EditUser';
import DeleteUser from './DeleteUser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewUser = () => {
  const [newUsers, setNewUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    contact: ''
  });

  const fetchUsers = () => {
   axios.get('http://localhost:5000/api/newusers')
  .then(res => setNewUsers(res.data))
  .catch(err => {
    console.error('Error fetching new users:', err);
    toast.error('Error fetching users');
   });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditUser(user._id);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      company: user.company,
      contact: user.contact
    });
  };

  return (
    <div className="user-container">
      <h2>New User Registrations</h2>
      <ToastContainer />
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {newUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.company}</td>
                <td>{user.contact}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(user)}>Edit</button>
                  <DeleteUser userId={user._id} onDelete={fetchUsers} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editUser && (
        <EditUser
          editUser={editUser}
          formData={formData}
          setFormData={setFormData}
          setEditUser={setEditUser}
          refreshUsers={fetchUsers}
        />
      )}
    </div>
  );
};

export default NewUser;
