    import React, { useState, useEffect } from 'react'; // hooks
    import { Link, useNavigate } from 'react-router-dom';
    import Navbar from '../../components/navbar/navbar.jsx';
    import Footer from '../../components/footer/footer.jsx';
    import Chatbot from '../../components/chatbot/chatbot.jsx';
    import { jwtDecode } from "jwt-decode";
    import { motion, AnimatePresence } from 'framer-motion'; // animations
    import './index.css';

    /* animated text from the banner */
    const texts = [
    "Your Health Starts Here",
    "We provide high-quality medical care",
    "Here for Your Health, Every Step of the Way",
    "We are here to help you anytime",
    "Advanced Medical Solutions for All Your Needs"
    ];

    const TextSwitcher = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 6000); // Change every 6  seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-4xl">
        <AnimatePresence>
            <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="absolute w-full"
            >
            <h1 className="text-xxs font-bold mb-3 sm:text-xl md:text-2xl lg:text-3xl">{texts[index]}</h1>
            {/* Adjusted font sizes for different screen sizes */}
            </motion.div>
        </AnimatePresence>
        </div>
    );
    };

    const MainPage = () => {
    // Function to navigate through the pages
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [rut, setRut] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.fullName); 
            setRut(decodedToken.rut); 
            setEmail(decodedToken.email);
        }
    }, []);

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <>
        <Navbar />
        {/* banner */}
        <div className="absolute mt-navbar relative">
            <img
            className="h-auto w-full shadow-bottom"
            src="src/images/index/banner.png"
            alt="Hospital banner"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <TextSwitcher />
            </div>
            
        
        </div>

        {/* content */}
        {/* Section with 4 rounded squares */}
        <div className="flex justify-center gap-20 my-20">
        {userName && <h2 className="text-xl text-white mt-4">Welcome, {rut} {userName}!</h2>}
            <Link to="/schedule" className="shortcuts">
                <i className="fas fa-calendar-alt fa-2x mb-2 text-red-500"></i> {/* Icon for Appointment */}
                <p className="text-center font-semibold">Appointment</p> {/* Text */}
            </Link>
            <a href='#' className="shortcuts">
                <i className="fas fa-map-marker-alt fa-2x mb-2 text-blue-500"></i> {/* Icon for Doctors */}
                <p className="text-center font-semibold">Locations</p> {/* Text */}
            </a>
            <a href='#' className="shortcuts">
                <i className="fas fa-clipboard-list fa-2x mb-2 text-green-500"></i> {/* Icon for Services */}
                <p className="text-center font-semibold">Specialities</p> {/* Text */}
            </a>
            <a href='#' className="shortcuts">
                <i className="fas fa-user-md fa-2x mb-2 text-yellow-500"></i> {/* Icon for Customer Service */}
                <p className="text-center font-semibold">Doctors {email}</p> {/* Text */}
            </a>
        </div>

        {/* locations */}
        <p className="mb-banner text-center text-3xl font-semibold text-gray-800 mb-4">Locations</p>
        <div className="flex flex-wrap justify-center gap-4 my-4">
            <div className="max-w-xs">
                <a href="#" className="flex flex-col location-card">
                    <img className="object-cover w-full h-48 rounded-3xl" src="src/images/index/hospital.jpg" alt="Hospital 1"/>
                    <div className="location-overlay">
                        <p className="location-text">Rio imperial 460</p>
                        <button className="location-button" onClick={() => {/* Maps */}}>
                            View on map
                        </button>
                    </div>
                </a>
            </div>
            <div className="max-w-xs">
                <a href="#" className="flex flex-col location-card">
                    <img className="object-cover w-full h-48 rounded-3xl" src="src/images/index/hospital1.jpg" alt="Hospital 2"/>
                    <div className="location-overlay">
                        <p className="location-text">Pje Mar Rojo 2489</p>
                        <button className="location-button" onClick={() => {/* Maps */}}>
                            View on map
                        </button>
                    </div>
                </a>
            </div>
            <div className="max-w-xs">
                <a href="#" className="flex flex-col location-card">
                    <img className="object-cover w-full h-48 rounded-3xl" src="src/images/index/hospital2.jpg" alt="Hospital 3"/>
                    <div className="location-overlay">
                        <p className="location-text">Ñuñoa 345</p>
                        <button className="location-button" onClick={() => {/* Maps */}}>
                            View on map
                        </button>
                    </div>
                </a>
            </div>
        </div>

        {/* Specialities */}
        <p className="mb-banner text-center text-3xl font-semibold text-gray-800 mb-4">Specialities</p>
        <div className="flex flex-wrap justify-center gap-4 my-4">

            <div className="max-w-xs flex flex-col location-card">
                <img className="object-cover w-full h-48 rounded-3xl" src="src/images/index/hospital.jpg" alt="Hospital 1"/>
                <div className="location-overlay">
                    <p className="location-text">Rio imperial 460</p>
                    <button className="location-button" onClick={() => {/* Maps */}}>
                        View on map
                    </button>
                </div>
            </div>
            <div className="max-w-xs">
                <a href="#" className="flex flex-col location-card">
                    <img className="object-cover w-full h-48 rounded-3xl" src="src/images/index/hospital1.jpg" alt="Hospital 2"/>
                    <div className="location-overlay">
                        <p className="location-text">Pje Mar Rojo 2489</p>
                        <button className="location-button" onClick={() => {/* Maps */}}>
                            View on map
                        </button>
                    </div>
                </a>
            </div>
            <div className="max-w-xs">
                <a href="#" className="flex flex-col location-card">
                    <img className="object-cover w-full h-48 rounded-3xl" src="src/images/index/hospital2.jpg" alt="Hospital 3"/>
                    <div className="location-overlay">
                        <p className="location-text">Ñuñoa 345</p>
                        <button className="location-button" onClick={() => {/* Maps */}}>
                            View on map
                        </button>
                    </div>
                </a>
            </div>
        </div>

        <Footer />
        <Chatbot />
        </>
    );
    };

    export default MainPage;
