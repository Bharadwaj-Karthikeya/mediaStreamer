export default function SuggestionBox({ searchTerm }) {
  if (!searchTerm) return null

  return (
    <div className="suggestion-panel">
      <div className="suggestion-row">{searchTerm}</div>
    </div>
  )
}