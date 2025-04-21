import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Search.css';
import NotFound404 from './components/NotFound404/NotFound404';

const SearchAutoPrint = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('fullName');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionsRef = useRef([]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`https://register-event-cwsv.onrender.com/api/search/autocomplete?q=${query}&type=${type}`);
        setSuggestions(res.data);
        setActiveIndex(-1);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [query, type]);

  const handleSelect = (user) => {
    const printableContent = `
      <html>
        <head>
          <title>Print Pass</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; margin: 0; background: #f5f5f5; }
            .badge { border: 2px solid #333; padding: 20px; width: 300px; margin: 10px auto; background: #fff; text-align: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
            h2 { margin: 0 0 10px; font-size: 24px; font-weight: bold; color: #333; }
            p { margin: 5px 0; font-size: 18px; color: #666; }
          </style>
        </head>
        <body>
          <div class="badge">
            <h2>${user.name || 'Not Available'}</h2>
            <p>${user.companyName || 'Not Available'}</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank', 'width=600,height=400');
    printWindow.document.open();
    printWindow.document.write(printableContent);
    printWindow.document.close();
    setSuggestions([]);
    setQuery('');
  };

  const handleSearch = async () => {
    if (query.trim()) {
      try {
        const res = await axios.get(`https://register-event-cwsv.onrender.com/api/search/autocomplete?q=${query}&type=${type}`);
        const user = res.data[0];
        if (user) handleSelect(user);
        else alert('No matching user found.');
      } catch (err) {
        console.error('Search error:', err);
        alert(err.response ? `Server responded with error: ${err.response.status}` : 'Network error occurred.');
      }
    }
  };

  const highlightMatch = (text) => {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        handleSelect(suggestions[activeIndex]);
      } else {
        handleSearch();
      }
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setActiveIndex(-1);
  };

  return (
    <div className="search-container">
      <h2>Search</h2>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="dropdown"
      >
        <option value="fullName">Full Name</option>
        <option value="email">Email</option>
        <option value="companyName">Company Name</option>
        <option value="contactNo">Contact Number</option>
      </select>

      <div className="search-box">
        <input
          type="text"
          placeholder={`Search by ${type}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button className="clear-btn" onClick={clearSearch} title="Clear search">✕</button>
        )}
        <button onClick={handleSearch} className="search-btn" title="Click to search">
          Search
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((user, index) => (
            <li
              key={user._id}
              ref={(el) => (suggestionsRef.current[index] = el)}
              onClick={() => handleSelect(user)}
              className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
              dangerouslySetInnerHTML={{ __html: highlightMatch(user.name || '') }}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchAutoPrint;
