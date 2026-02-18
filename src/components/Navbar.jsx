import { useNavigate } from "react-router-dom";

export default function Navbar() {
  
    const navigate = useNavigate();
    function handleSearch(e) {
        if (e.key === 'Enter') {
            navigate(`/search?q=${e.target.value}`);
        }
    }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container w-screen flex justify-between items-center h-12">
        <h1 className="text-xl font-bold">Media Streamer</h1>
        
        <input type="text" placeholder="Search..." className="bg-white w-80 h-10 text-black rounded px-4 py-2" onKeyDown={handleSearch} />   
          <button className="hover:text-gray-300">Settings</button>
      </div>
    </nav>
  );
}