import React from 'react'
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();

     function handleNavigation(path) {
        navigate(path);
    }

    return (
        <aside className="w-64 bg-gray-700 text-white p-4">
            <ul className="flex flex-col gap-y-5">
                <li className="mb-2">
                    <button className="hover:text-gray-300" onClick={() => handleNavigation("/")}>Home</button>
                </li>
                <li className="mb-2">
                    <button className="hover:text-gray-300" onClick={() => handleNavigation("/watch")}>Watch</button>
                </li>
                <li className="mb-2">
                    <button className="hover:text-gray-300" onClick={() => handleNavigation("/upload")}>Upload</button>
                </li>
                <li className="mb-2">
                    <button className="hover:text-gray-300" onClick={() => handleNavigation("/profile")}>Profile</button>
                </li>
            </ul>
        </aside>
    )
}