import React from 'react';
import axios from 'axios';

const ExportButton = () => {
  const handleExport = async () => {
    try {
      const response = await axios.get('/api/users/export', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'UsersExport.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed');
    }
  };

  return (
    <button onClick={handleExport}>Export</button>
  );
};

export default ExportButton;
