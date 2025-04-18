import React, { useState } from 'react';
import {
  FaTachometerAlt, FaUser, FaPlus, FaEnvelope, FaList, FaBars,
  FaEye, FaRegCalendarPlus, FaCog, FaKey, FaSignOutAlt
} from 'react-icons/fa';
import {
  ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent, SubMenu
} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="sidebar-container">
      <ProSidebar collapsed={collapsed}>
        <SidebarHeader>
          <div className="sidebar-header">
            <FaBars className="toggle-icon" onClick={handleToggleSidebar} />
            {!collapsed && <span className="admin-text">Admin Dashboard</span>}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem icon={<FaTachometerAlt />}>
              <Link to="/admin/dashboard">Dashboard</Link>
            </MenuItem>

            <SubMenu title="User" icon={<FaUser />}>
              <MenuItem icon={<FaList />}>
                <Link to="/admin/registered-user">Registered User</Link>
              </MenuItem>
              <MenuItem icon={<FaPlus />}>
                <Link to="/admin/new-user">New User</Link>
              </MenuItem>
            </SubMenu>

            <SubMenu title="Invitation" icon={<FaRegCalendarPlus />}>
              <MenuItem icon={<FaEnvelope />}>
                <Link to="/admin/create-invitation">Create Invitation</Link>
              </MenuItem>
              <MenuItem icon={<FaEye />}>
                <Link to="/admin/view-invitation">View Invitation</Link>
              </MenuItem>
            </SubMenu>

            {/* ✅ Settings Submenu */}
            <SubMenu title="Settings" icon={<FaCog />}>
              <MenuItem icon={<FaKey />}>
                <Link to="/admin/update-password">Update Password</Link>
              </MenuItem>
              <MenuItem icon={<FaSignOutAlt />}>
                <Link to="/admin/logout">Logout</Link>
              </MenuItem>
            </SubMenu>

          </Menu>
        </SidebarContent>
      </ProSidebar>
    </div>
  );
};

export default Sidebar;