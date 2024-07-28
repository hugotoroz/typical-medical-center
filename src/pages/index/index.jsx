import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar.jsx';

const MainPage = () => {

  ////Function to navegate trough the pages

  const navigate = useNavigate();

  const handleLoginRedirect = () => {
      navigate('/login');
  };

  return (
    <>
    <Navbar />

    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl pt-16">
        <div className="md:flex text-left">
            <div className="md:shrink-0">
                <img className="h-48 w-full object-cover md:h-full md:w-48" src="src/images/mainPage/hospital.jpg" alt="Modern building architecture"/>
            </div>
            <div className="p-8">
                <div className="tracking-wide text-sm text-indigo-500 font-semibold">Company retreats</div>
                <a href="#" className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Incredible accommodation for your team</a>
                <p className="mt-2 text-slate-500">Looking to take your team away on a retreat to enjoy awesome food and take in some sunshine? We have a list of places to do just that.</p>
                <button onClick={handleLoginRedirect} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Go to Login
                </button>
            </div>
        </div>
    </div>
    </>
    
  );
};

export default MainPage;