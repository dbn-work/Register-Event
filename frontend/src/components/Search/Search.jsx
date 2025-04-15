import React, { useEffect } from 'react';
import './Search.css';
import { FiSearch, FiMenu } from 'react-icons/fi';

const Search = () => {
  useEffect(() => {
    const text = "Search anything...";
    let i = 0;
    const input = document.getElementById("searchInput");
    const typingInterval = setInterval(() => {
      if (input && i <= text.length) {
        input.setAttribute("placeholder", text.substring(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
  }, []);

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-box">
          <FiMenu className="menu-icon" />
          <input
            type="text"
            className="search-input"
            id="searchInput"
            placeholder=""
          />
          <FiSearch className="search-icon" />
        </div>
        <button className="submit-btn">Search</button>
      </div>
    </div>
  );
};

export default Search;
