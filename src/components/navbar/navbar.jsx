import React from 'react';
import './navbar.css'

function Navbar() {



    return (
        <>
            <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
                <div className="max-w-8xl mx-auto px-4 py-4 flex items-center">
                    <div className="flex items-center">
                        <img className="w-10 h-10 rounded-full" src="src/images/mainPage/hospital.jpg" alt="Logo" />
                    </div>
                    <div className="hidden md:flex space-x-8 ml-7">
                        <a href="#" className="text-gray-700 hover:text-blue-500">Services</a>
                        <a href="#" className="text-gray-700 hover:text-blue-500">Patient</a>
                        <a href="#" className="text-gray-700 hover:text-blue-500">Contact</a>
                    </div>
                    <div className="flex items-center space-x-6 ml-auto">
                        <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1.5 px-6 border border-blue-500 hover:border-transparent rounded-lg">
                            Reserve
                        </button>
                        <img className="w-10 h-10 rounded-full" src="src/images/navbar/profile.jpg" alt="User" />
                    </div>
                </div>
            </nav>
        </>

    );
}

export default Navbar;