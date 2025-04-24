// Inside RegisteredUser.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from "react-paginate";
import "./RegisteredUser.css";

const RegisteredUser = () => {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://register-event-cwsv.onrender.com/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setEditedUser(user);
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditedUser({});
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editedUser.ideac?.trim()) newErrors.ideac = "IDEAC is required";
    if (!editedUser.name?.trim()) newErrors.name = "Name is required";
    if (!editedUser.companyName?.trim()) newErrors.companyName = "Company is required";
    if (!editedUser.email?.trim()) newErrors.email = "Email is required";
    if (!editedUser.phone?.trim()) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      const { ideac, name, companyName, email, phone } = editedUser;
      await axios.put(
        `https://register-event-cwsv.onrender.com/api/users/${editId}`,
        { ideac, name, companyName, email, phone }
      );
      toast.success("User updated successfully!");
      setEditId(null);
      setEditedUser({});
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user!");
    }
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete user?")) {
      try {
        await axios.delete(`https://register-event-cwsv.onrender.com/api/users/${id}`);
        fetchUsers();
        toast.success("User deleted!");
      } catch (error) {
        toast.error("Error deleting user!");
        console.error('Error deleting user:', error);
      }
    }
  };


  const handleDeleteAll = async () => {
  if (window.confirm("Are you sure you want to delete all users?")) {
    try {
      await axios.delete("https://register-event-cwsv.onrender.com/api/users/deleteAll");
      toast.success("All users deleted!");
      fetchUsers(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting all users:", error);
      toast.error("Failed to delete all users.");
    }
  }
};

  
  


  const handleImport = async () => {
    if (!file) return alert("Choose a file!");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post("https://register-event-cwsv.onrender.com/api/users/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      fetchUsers();
      toast.success("File imported successfully!");
    } catch (err) {
      toast.error("Import failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('https://register-event-cwsv.onrender.com/api/users/export', {
        responseType: 'blob',
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data. Please try again.');
    }
  };

  const handleSort = (column) => {
    const sortedUsers = [...users].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[column] > b[column] ? 1 : -1;
      } else {
        return a[column] < b[column] ? 1 : -1;
      }
    });
    setUsers(sortedUsers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const usersToDisplay = filteredUsers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="registered-user-container">
      <h2>Registered Users</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by Name or Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

   
<div className="import-export-controls">
  <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} />
  <button onClick={handleImport} disabled={loading}>
    {loading ? "Importing..." : "Import Excel"}
  </button>
  <button onClick={handleExport}>Export Excel</button>
  <button className="delete-excel-btn" onClick={handleDeleteAll}>Delete All</button>
</div>


      <table className="user-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("sno")}>Sr.No</th>
            <th onClick={() => handleSort("ideac")}>IDEAC</th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("companyName")}>Company</th>
            <th onClick={() => handleSort("email")}>Email</th>
            <th onClick={() => handleSort("phone")}>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersToDisplay.length > 0 ? (
            usersToDisplay.map((u, index) => (
              <tr key={u._id}>
                <td>{u.sno || index + 1}</td>
                <td>{u.ideac}</td>
                <td>{u.name}</td>
                <td>{u.companyName}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Edit</button>
                  <button onClick={() => handleDelete(u._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={Math.ceil(filteredUsers.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination-container"}
        activeClassName={"active"}
      />

      {/* Modal with validation */}
      {editId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit User</h3>

            <input
              name="ideac"
              value={editedUser.ideac}
              onChange={handleChange}
              placeholder="IDEAC"
              className={errors.ideac ? "input-error" : ""}
            />
            {errors.ideac && <p className="error-text">{errors.ideac}</p>}

            <input
              name="name"
              value={editedUser.name}
              onChange={handleChange}
              placeholder="Name"
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}

            <input
              name="companyName"
              value={editedUser.companyName}
              onChange={handleChange}
              placeholder="Company"
              className={errors.companyName ? "input-error" : ""}
            />
            {errors.companyName && <p className="error-text">{errors.companyName}</p>}

            <input
              name="email"
              value={editedUser.email}
              onChange={handleChange}
              placeholder="Email"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}

            <input
              name="phone"
              value={editedUser.phone}
              onChange={handleChange}
              placeholder="Phone"
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}

            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredUser;
