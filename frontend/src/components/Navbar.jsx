import React, { useState } from "react";
import { Wallet, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll } from "motion/react";
import { toggleLoginModal, toggleSignupModal } from "../redux/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";

const Navbar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const { loginModal } = useSelector((state) => state.modal); 
  const { signupModal } = useSelector((state) => state.modal); 
  const { forgotPasswordModal } = useSelector((state) => state.modal); 

  return (
    <>
      <motion.div
        id="scroll-indicator"
        className="z-[60]"
        style={{
          scaleX: scrollYProgress,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          originX: 0,
          backgroundColor: "#2dfc49ff",
        }}
      />
      <nav className="bg-black text-white px-6 py-4 fixed w-full top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.2 }}
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-wide text-white">
              FinTrack
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {["Features", "Pricing", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={`${item.toLowerCase()}`}
                className="text-gray-300 hover:text-green-400 transition-colors font-medium text-lg"
              >
                {item}
              </Link>
            ))}
            <motion.button
              onClick={() => dispatch(toggleLoginModal())}
              whileTap={{ scale: 0.9 }}
              className="border border-gray-700 px-8 py-2 rounded-full text-lg font-semibold hover:border-green-300 cursor-pointer"
            >
              Login
            </motion.button>
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, duration: 0.3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(toggleSignupModal())}
              className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-2 rounded-full text-lg font-semibold hover:border-green-300 cursor-pointer"
            >
              Join Now
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-green-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800 bg-black/95">
            <div className="flex flex-col space-y-4 pt-4">
              {["Features", "Pricing", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-green-400 transition-colors px-2"
                >
                  {item}
                </a>
              ))}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(toggleLoginModal())}
                className="border border-gray-700 px-8 py-2 rounded-full text-lg font-semibold hover:border-green-300 cursor-pointer"
              >
                Login
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(toggleSignupModal())}
                className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-2 rounded-full text-lg font-semibold hover:border-green-300 cursor-pointer"
              >
                Join Now
              </motion.button>
            </div>
          </div>
        )}
      </nav>
      {
        loginModal ? 
        <Login />
        : null
      }
      {
        signupModal ?
        <Signup /> 
        : null 
      }
      {
        forgotPasswordModal ?
        <ForgotPassword /> 
        : null
      }
    </>
  );
};

export default Navbar;
