import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, scale } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  }
  const handleSignup = () => {
    navigate('/signup');
    setIsMenuOpen(false);
  }

  return (
    <>
      <nav className="w-auto text-white flex items-center justify-between bg-black h-16 rounded-full m-3 sm:m-5 px-4 sm:px-5 relative">
        {/* Logo */}
        <motion.div
        whileHover={{scale: 1.1}}
        onClick={() => navigate('/')}
        className="flex gap-1 items-center logo cursor-pointer">
          <img src="./images/logo.png" alt="logo" className="h-14" />
          <h2 className="text-xl sm:text-2xl font-medium">Finzy</h2>
        </motion.div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex gap-6 xl:gap-8 text-base xl:text-lg">
          <h4 className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
            Personal
          </h4>
          <h4 className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
            Business
          </h4>
          <h4 className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
            Partner
          </h4>
          <h4 className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">
            About Us
          </h4>
        </div>

        {/* Desktop Auth Button */}
        <div className="hidden md:block">
          {
            user ?
            <motion.button
          whileHover={{scale : 1.1}}
          onClick={() => handleLogout()}
          className="bg-white text-black rounded-full px-4 sm:px-6 py-1 sm:py-2 text-sm sm:text-lg font-medium hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
            Logout
          </motion.button>
            : 
            <motion.button
          whileHover={{scale : 1.1}}
          onClick={() => navigate('/login')}
          className="bg-white text-black rounded-full px-4 sm:px-6 py-1 sm:py-2 text-sm sm:text-lg font-medium hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
            Sign In
          </motion.button>
          }
          
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          onClick={toggleMenu}
        >
          <div
            className={`relative z-50 w-5 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></div>
          <div
            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`relative z-50 w-5 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></div>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMenu}
          ></div>

          {/* Mobile Menu */}
          <div className="fixed top-20 left-3 right-3 sm:left-5 sm:right-5 bg-black rounded-2xl z-50 md:hidden animate-slideDown">
            <div className="flex flex-col p-6 space-y-6">
              {/* Mobile Nav Items */}
              <div className="flex flex-col space-y-4 text-white">
                <h4 className="text-lg hover:text-gray-300 transition-colors duration-200 cursor-pointer py-2 border-b border-gray-700">
                  Personal
                </h4>
                <h4 className="text-lg hover:text-gray-300 transition-colors duration-200 cursor-pointer py-2 border-b border-gray-700">
                  Business
                </h4>
                <h4 className="text-lg hover:text-gray-300 transition-colors duration-200 cursor-pointer py-2 border-b border-gray-700">
                  Partner
                </h4>
                <h4 className="text-lg hover:text-gray-300 transition-colors duration-200 cursor-pointer py-2 border-b border-gray-700">
                  About Us
                </h4>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                whileTap={{scale: 0.9}}
                onClick={() => handleLogin()}
                className="bg-white text-black rounded-full px-6 py-3 text-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                  Sign In
                </motion.button>
                <motion.button
                whileTap={{scale: 0.9}}
                onClick={() => handleSignup()}
                className="bg-transparent border-2 border-white text-white rounded-full px-6 py-3 text-lg font-medium hover:bg-white hover:text-black transition-all duration-200">
                  Sign Up
                </motion.button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom Animation Styles */}
      <style>{`
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slideDown {
    animation: slideDown 0.3s ease-out;
  }
`}</style>
    </>
  );
};

export default Navbar;
