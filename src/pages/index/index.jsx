    import React, { useState, useEffect } from 'react'; // hooks
    import { useNavigate } from 'react-router-dom';
    import Navbar from '../../components/navbar/navbar.jsx';
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

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <>
        <Navbar />
        {/* banner */}
        <div className="mt-navbar relative w-full max-h-[500px]">
            <img
            className="w-full h-full object-cover shadow-bottom "
            src="src/images/index/banner.png"
            alt="Hospital banner"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <TextSwitcher />
            </div>
            
        
        </div>

        {/* content */}
        {/* locations */}
        <p className="mb-banner text-center text-3xl font-semibold text-gray-800 mb-4">Locations</p>
        <div className="flex flex-wrap justify-center gap-4 my-4">
            <div className="max-w-xs">
                <a href="#" className="flex flex-col">
                    <img className="object-cover w-full h-48 rounded-3xl" src="src/images/index/hospital.jpg" alt=""/>
                </a>
            </div>
            <div className="max-w-xs">
                <a href="#" className="flex flex-col">
                    <img className="object-cover w-full h-48 rounded-3xl" src="src/images/index/hospital1.jpg" alt=""/>
                </a>
            </div>
            <div className="max-w-xs">
                <a href="#" className="flex flex-col">
                    <img className="object-cover w-full h-48 rounded-3xl" src="src/images/index/hospital2.jpg" alt=""/>
                </a>
            </div>
        </div>

        {/* specialties */}
        <p className="mb-banner text-center text-3xl font-semibold text-gray-800 mb-4">Specialties</p>
        <div className="flex flex-wrap justify-center gap-4 my-4">
            <div className="max-w-xs">
                <a href="#" className="flex flex-col">
                    <img className="object-cover w-full h-48 rounded-3xl" src="src/images/index/hospital.jpg" alt=""/>
                </a>
            </div>
            <div className="max-w-xs">
                <a href="#" className="flex flex-col">
                    <img className="object-cover w-full h-48 rounded-3xl" src="src/images/index/hospital1.jpg" alt=""/>
                </a>
            </div>
            <div className="max-w-xs">
                <a href="#" className="flex flex-col">
                    <img className="object-cover w-full h-48 rounded-3xl" src="src/images/index/hospital2.jpg" alt=""/>
                </a>
            </div>
        </div>
        
        </>
    );
    };

    export default MainPage;
