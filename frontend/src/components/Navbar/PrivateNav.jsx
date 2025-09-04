import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice.js";
const PrivateNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [scope, setScope] = useState("All");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="w-auto text-white flex items-center justify-between bg-gradient-to-r from-gray-900 via-black to-gray-900 h-16 rounded-full m-3 sm:m-5 px-4 sm:px-5 relative shadow-lg border border-gray-800">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/dashboard")}
          className="flex gap-1 items-center cursor-pointer"
        >
          <img src="./images/logo.png" alt="logo" className="h-14" />
          <h2 className="text-xl sm:text-2xl font-medium">Finzy</h2>
        </motion.div>



        {/* Desktop Profile + Logout */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white cursor-pointer font-medium border-2 border-gray-600 hover:border-gray-400 transition-colors shadow-lg"
            title={user?.name || "Profile"}
          >
            {user?.fullname?.[0]?.toUpperCase() || "U"}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleLogout}
            className="bg-white text-black rounded-full px-4 sm:px-6 py-1 sm:py-2 text-sm sm:text-lg font-medium hover:bg-gray-100 transition-colors duration-200"
          >
            Logout
          </motion.button>
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
          <div className="fixed top-20 left-3 right-3 sm:left-5 sm:right-5 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl z-50 md:hidden animate-slideDown shadow-2xl border border-gray-700">
            <div className="flex flex-col p-6 space-y-6">
              {/* Search (Mobile) */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transactions, accounts..."
                  className="w-full px-4 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 outline-none border border-gray-600 focus:border-blue-400 focus:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Scope Toggle (Mobile) */}
              <div>
                <p className="text-gray-400 text-sm mb-3 font-medium">Filter by:</p>
                <div className="flex bg-white/10 backdrop-blur-sm rounded-full overflow-hidden text-sm border border-gray-600">
                  {["All", "Personal", "Business"].map((s) => (
                    <motion.button
                      key={s}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setScope(s)}
                      className={`flex-1 px-3 py-3 transition-all duration-200 font-medium ${
                        scope === s 
                          ? "bg-white text-black shadow-md" 
                          : "text-gray-300 hover:text-white hover:bg-white/20"
                      }`}
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Profile Section (Mobile) */}
              <div className="border-t border-gray-700 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium border-2 border-gray-600 shadow-lg">
                      {user?.fullname?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg">{user?.fullname || "User"}</p>
                      <p className="text-gray-400 text-sm">{user?.email || "user@example.com"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Logout Button (Mobile) */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="w-full mt-4 bg-white text-black rounded-full px-6 py-3 text-lg font-medium hover:bg-gray-100 transition-colors duration-200"
                >
                  Logout
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

export default PrivateNav;