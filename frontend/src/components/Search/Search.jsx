// src/components/Search.jsx
import React, { useState } from "react";
import axios from "axios";
import { FiMenu, FiSearch } from "react-icons/fi";
import "./Search.css";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const handleSearch = async () => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) return;

    setIsLoading(true);
    setError("");
    setResults([]);
    setCurrentPage(1);

    try {
      const response = await axios.post("https://register-event-cwsv.onrender.comcd /api/search", {
        keyword: trimmedKeyword,
      });

      if (response.data.message) {
        setError(response.data.message);
      } else {
        setResults(response.data);
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const cleanValue = (value) => (value && value !== "—" ? value : "Not Available");

  const handlePrint = (item) => {
    const content = `
      <div class="ticket">
        <div class="ticket-content">
          <div class="line">${cleanValue(item['Customer Name'])}</div>
          <div class="line">${cleanValue(item['Company Name'])}</div>
        </div>
      </div>
    `;
  
    const printWindow = window.open('', '', 'height=600,width=400');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Ticket</title>
          <style>
            @media print {
              @page {
                size: 4in 6in;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: "Segoe UI", sans-serif;
                background: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
              }
            }
  
            body {
              margin: 0;
              padding: 0;
              font-family: "Segoe UI", sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: #fff;
            }
  
            .ticket {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
  
            .ticket-content {
              text-align: center;
            }
  
            .ticket-content .line {
              font-size: 26px;
              font-weight: bold;
              margin: 10px 0;
              color: #000;
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
  

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(results.length / resultsPerPage);

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-box">
          <FiMenu className="menu-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <FiSearch className="search-icon" onClick={handleSearch} />
        </div>
        <button className="submit-btn" onClick={handleSearch}>Search</button>
      </div>

      <div className="search-results-wrapper">
        {isLoading && <div className="spinner">⏳ Searching...</div>}
        {error && <p className="error-message">{error}</p>}

        {!isLoading && currentResults.length > 0 && (
          <div className="results">
            <h3>Search Results:</h3>
            <div className="results-grid">
              {currentResults.map((item, index) => (
                <div className="result-item" key={index}>
                  <div className="customer-info">
                    <span className="label">Customer Name:</span>
                    <span className="value">{cleanValue(item["Customer Name"])}</span>
                  </div>
                  <div className="company-info">
                    <span className="label">Company Name:</span>
                    <span className="value">{cleanValue(item["Company Name"])}</span>
                  </div>
                  <button className="print-btn" onClick={() => handlePrint(item)}>Print</button>
                </div>
              ))}
            </div>

            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="submit-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="submit-btn"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {!isLoading && results.length === 0 && keyword && !error && (
          <p className="no-results">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
