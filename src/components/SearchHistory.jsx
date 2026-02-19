import React from 'react'

export default function SearchHistory({ 
  searchHistory, 
  onSelectSearch, 
  onRemoveSearch, 
  onClearAll 
}) {
  if (searchHistory.length === 0) {
    return (
      <div className="history-popover empty">
        <p>No search history</p>
      </div>
    )
  }

  return (
    <div className="history-popover">
      <div className="history-header">
        <span>Search History</span>
        <button type="button" onClick={onClearAll}>Clear all</button>
      </div>

      <div className="history-list">
        {searchHistory.map((search, index) => (
          <div key={index} className="history-row">
            <button type="button" onClick={() => onSelectSearch(search)}>{search}</button>
            <button
              type="button"
              className="history-remove"
              onClick={() => onRemoveSearch(search)}
              aria-label={`Remove ${search} from history`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}