
export default function SuggestionBox({ searchTerm}) {
  return (
    <div className="absolute bg-white border border-gray-300 rounded mt-1 w-full z-10">
       {searchTerm && (
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
          {searchTerm}
        </div>
      )}
    </div>
  );
}