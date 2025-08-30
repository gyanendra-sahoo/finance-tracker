import React, { useState } from "react";
import { Wallet, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice"; 

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const { user, loading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      {/* Scroll Progress Bar */}
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
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
            {["Dashboard", "Pricing", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-gray-300 hover:text-green-400 transition-colors font-medium text-lg"
              >
                {item}
              </Link>
            ))}

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  disabled={loading}
                  className="border border-gray-700 px-6 py-2 rounded-full text-sm font-semibold hover:border-red-400 hover:text-red-400 transition-all disabled:opacity-50"
                >
                  {loading ? "Logging out..." : "Logout"}
                </motion.button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-gray-700 px-8 py-2 rounded-full text-lg font-semibold hover:border-green-300 transition-all"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-2 rounded-full text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                  >
                    Join Now
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-300 hover:text-green-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden mt-4 pb-4 border-t border-gray-800 bg-black/95"
          >
            <div className="flex flex-col space-y-4 pt-4">
              {["Dashboard", "Pricing", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-green-400 transition-colors px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}

              {/* Auth Section Mobile */}
              {user ? (
                <div className="flex flex-col space-y-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    disabled={loading}
                    className="border border-gray-700 px-6 py-2 rounded-full text-sm font-semibold hover:border-red-400 hover:text-red-400 transition-all disabled:opacity-50 mx-2"
                  >
                    {loading ? "Logging out..." : "Logout"}
                  </motion.button>
                </div>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="border border-gray-700 px-8 py-2 rounded-full text-lg font-semibold hover:border-green-300 transition-all mx-2"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-2 rounded-full text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all mx-2"
                    >
                      Join Now
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
};

export default Navbar;