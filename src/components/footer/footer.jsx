import React from 'react';
import './footer.css';
import logo from '../../images/logo/logo2.jpeg'

function Footer() {

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex justify-between items-center max-w-6xl px-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-16 w-auto mr-4" />
        </div>
        
        {/* Text Columns Section */}
        <div className="flex flex-col text-center max-w-xs">
          <p className="mb-1">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam vel alias perspiciatis impedit aliquid, laborum laboriosam</p>
        </div>
        
        <div className="flex flex-col text-center max-w-xs">
          <p className="mb-1">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam vel alias perspiciatis impedit aliquid, laborum laboriosam</p>
        </div>

        <div className="flex flex-col text-center max-w-xs">
          <p className="mb-1">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam vel alias perspiciatis impedit aliquid, laborum laboriosam</p>
        </div>
      </div>

      {/* Rights Reserved Section */}
      <div className="border-t border-gray-600 w-full mt-4">
        <p className="text-center py-2">All Rights Reserved © {new Date().getFullYear()} [Los Tres].</p>
      </div>
    </footer>
  );
}

export default Footer;