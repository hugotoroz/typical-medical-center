import React, { useState, useEffect } from 'react'; // hooks
import { Link, useNavigate } from 'react-router-dom';
import Chatbot from '../../components/chatbot/chatbot.jsx';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Sidebar, SidebarItem } from '../../components/sidebar/sidebar.jsx';
import './doctorsPage.css';

const DoctorsPage = () => {
// Function to navigate through the pages
const navigate = useNavigate();

const [userName, setUserName] = useState('');
const [rut, setRut] = useState('');

useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.fullName); 
        setRut(decodedToken.rut); 
    }
}, []);

const handleLoginRedirect = () => {
    navigate('/login');
};

return (
    <>
    <div className="flex">
        <Sidebar>
          <SidebarItem iconName="Home" text="Home" active />
          <SidebarItem iconName="User" text="Profile" />
          <SidebarItem iconName="Settings" text="Settings" />
        </Sidebar>
    </div>
    </>
);
};

export default DoctorsPage;
