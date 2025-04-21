import React, { useState } from 'react';
import axios from 'axios';

const ImportButton = ({ onImport }) => {
  const [file, setFile] = useState(null);

  // Handle file selection
  const handleImport = async () => {
    if (!file) return alert('Please choose a file to import');

    const formData = new FormData();
    formData.append('file', file);  // Append the selected file
    try {
      const res = await axios.post('/api/users/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },  // Set headers for file upload
      });

      alert(res.data.message || 'Users imported successfully');
      onImport();  // Reload the user list after importing
    } catch (err) {
      console.error('Import error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to import users');
    }
  };

  return (
    <div style={{ display: 'inline-flex', gap: '1rem' }}>
      <input type="file" accept=".xlsx, .xls" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleImport}>Import</button>
    </div>
  );
};

export default ImportButton;
