import Navbar from  "./Navbar.jsx"
import Sidebar from "./Sidebar.jsx"

export default function Layout({children}){
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto p-4">
                    {children}
                </main>
            </div>
        </div>
    )
}