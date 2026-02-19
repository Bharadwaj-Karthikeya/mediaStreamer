import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchHistory from './SearchHistory.jsx'

export default function Navbar({ toggleSidebar }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Close search history when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveSearchToHistory = (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Remove duplicates and add to beginning
    const updatedHistory = [
      trimmedQuery,
      ...searchHistory.filter(item => item !== trimmedQuery)
    ].slice(0, 10); // Keep only last 10 searches

    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveSearchToHistory(searchQuery);
      navigate(`/search?q=${searchQuery}`);
      setShowHistory(false);
    }
  };

  const handleSelectSearch = (query) => {
    setSearchQuery(query);
    saveSearchToHistory(query);
    navigate(`/search?q=${query}`);
    setShowHistory(false);
  };

  const handleRemoveSearch = (query) => {
    const updatedHistory = searchHistory.filter(item => item !== query);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleClearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <nav className="nav-shell fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50 overflow-visible">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="icon-control"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 6h18M3 12h18M3 18h18"/>
          </svg>
        </button>
        <Link to="/" className="flex items-center gap-2">
          <span className="brand-mark text-xl font-semibold">Media Stream</span>
        </Link>
      </div>

      {/* Center Section - Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 relative" ref={searchRef}>
        <div className="search-shell">
          <div className="search-icon">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            placeholder="Search"
            className="search-input"
          />
          <button
            type="submit"
            className="search-btn"
          >
            <span>Go</span>
          </button>
        </div>

        {/* Search History Dropdown */}
        {showHistory && (
          <SearchHistory
            searchHistory={searchHistory}
            onSelectSearch={handleSelectSearch}
            onRemoveSearch={handleRemoveSearch}
            onClearAll={handleClearAllHistory}
          />
        )}
      </form>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Link to="/upload" className="icon-control" title="Upload">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </Link>
        <Link to="/profile" className="icon-control" title="Profile">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
          </svg>
        </Link>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="icon-control"
        >
          {isDarkMode ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.12-1.36-.98 1.37-2.58 2.26-4.38 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.78.88-3.38 2.26-4.38C12.92 3.04 12.46 3 12 3z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.12-1.36-.98 1.37-2.58 2.26-4.38 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.78.88-3.38 2.26-4.38C12.92 3.04 12.46 3 12 3z"/>
            </svg>
          )}
        </button>
      </div>
    </nav>
  )
}