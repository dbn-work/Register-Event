//DataTable.jsx

import React, { useState } from 'react';
import './DataTable.css';
import * as XLSX from 'xlsx';
const sampleData = [
  {
    name: 'Vijay Reddy',
    mobile: '7331122518',
    company: 'Alekhya Homes',
    email: 'vijay@gmail.com',
    mode: 'Search Result',
    card: 'N/A',
    timestamp: '2024-07-19 16:12:17',
  },
  {
    name: 'Abdul rahuman M',
    mobile: '8124513192',
    company: 'FDDI',
    email: 'abdul.rahuman@fddiindia.com',
    mode: 'New Registration',
    card: 'N/A',
    timestamp: '2024-07-19 18:09:00',
  },
];
const DataTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleExportToExcel = () => {
    const formattedData = sampleData.map((entry, index) => ({
      'Sr. No': index + 1,
      'Name': entry.name,
      'Mobile': entry.mobile,
      'Company': entry.company,
      'Email': entry.email,
      'Mode': entry.mode,
      'Card': entry.card,
      'Timestamp': entry.timestamp,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registration Data');
    XLSX.writeFile(workbook, 'registration_data.xlsx');
  };
  const filteredData = sampleData.filter((row) =>
    Object.values(row).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  return (
    <div className="table-container">
      <div className="table-header">
        <button className="export-btn" onClick={handleExportToExcel}>Export to Excel</button>
        <div>
          Search: <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Company</th>
            <th>Email</th>
            <th>Mode</th>
            <th>Card</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{row.name}</td>
              <td>{row.mobile}</td>
              <td>{row.company}</td>
              <td>{row.email}</td>
              <td>{row.mode}</td>
              <td>{row.card}</td>
              <td>{row.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default DataTable;
