import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import Register from './components/Register/RegistrationForm';
import Search from './components/Search/Search';
import Sidebar from './components/Layout/Sidebar';

import Dashboard from './components/Admin/Dashboard/Dashboard';
import RegisteredUser from './components/Admin/Users/RegisteredUser/RegisteredUser';
import NewUser from './components/Admin/Users/NewUser/NewUser';
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import AdminLogin from "./components/Admin/Login/AdminLogin";
import ConfirmationPage from './components/Admin/Invitations/Create-Invitations/ConfirmationPage';
import ViewInvitation from './components/Admin/Invitations/View-Invitation/ViewInvitation';
import UpdatePassword from './components/Admin/Settings/UpdatePassword';
import Logout from './components/Admin/Settings/Logout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Sidebar />
                <div className="main-content">
                  <Dashboard />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/registered-user"
          element={
            <ProtectedRoute> 
              <div className="app-container">
                <Sidebar />
                <div className="main-content">
                  <RegisteredUser />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/new-user"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Sidebar />
                <div className="main-content">
                  <NewUser />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/create-invitation"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Sidebar />
                <div className="main-content">
                  <ConfirmationPage/>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

      <Route
          path="admin/view-invitation"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Sidebar />
                <div className="main-content">
                  <ViewInvitation/>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

   {/* ✅ Settings Routes */}
   <Route path="/admin/update-password" element={
          <ProtectedRoute>
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <UpdatePassword />
              </div>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/admin/logout" element={
          <ProtectedRoute>
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <Logout />
              </div>
            </div>
          </ProtectedRoute>
        } />



      </Routes>
    </Router>
  );
}

export default App;
