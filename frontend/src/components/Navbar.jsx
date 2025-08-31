// import React, { useState } from "react";
// import { Wallet, Menu, X } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion, useScroll, AnimatePresence } from "framer-motion";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../redux/slices/authSlice";

// const navLinks = ["Dashboard", "Pricing", "About", "Contact"];

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { scrollYProgress } = useScroll();
//   const { user, loading } = useSelector((state) => state.auth);

//   // UI State for highlight animation
//   const [hovered, setHovered] = useState(null);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };
//   const mobileMenuVariants = {
//     closed: { opacity: 0, height: 0, transition: { staggerChildren: 0 } },
//     open: {
//       opacity: 1,
//       height: "auto",
//       transition: {
//         when: "beforeChildren",
//         staggerChildren: 0.09,
//         delayChildren: 0.1,
//         duration: 0.4,
//         ease: [0.42, 0, 0.58, 1],
//       },
//     },
//   };
//   const mobileItemVariants = {
//     closed: { opacity: 0, x: -24 },
//     open: { opacity: 1, x: 0 },
//   };

//   return (
//     <>
//       {/* Scroll Progress Bar */}
//       <motion.div
//         id="scroll-indicator"
//         className="z-"
//         style={{
//           scaleX: scrollYProgress,
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           height: 5,
//           originX: 0,
//           background: "linear-gradient(90deg, #2dfc49ff, #1dba63)",
//           boxShadow: "0 6px 20px 0 #1dba6370",
//           filter: "blur(0.5px)",
//         }}
//       />

//       <nav className="bg-black text-white px-6 py-4 fixed w-full top-0 z-50 shadow-2xl">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           {/* Logo */}
//           <motion.div
//             whileHover={{ scale: 1.08, boxShadow: "0px 2px 16px 0px #19e67fff" }}
//             whileTap={{ scale: 0.99 }}
//             onClick={() => navigate("/")}
//             className="flex items-center space-x-2 cursor-pointer"
//           >
//             <motion.div
//               className="w-10 h-10 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
//               whileHover={{
//                 boxShadow: "0 0 18px 1px #2dfc499e",
//                 scale: 1.13,
//               }}
//             >
//               <Wallet className="w-6 h-6 text-white" />
//             </motion.div>
//             <motion.span
//               className="text-2xl font-extrabold tracking-wider text-white drop-shadow"
//               whileHover={{
//                 textShadow: "0 2px 10px #2dfc49,0 0px 4px #222",
//                 color: "#2dfc49"
//               }}
//             >
//               FinTrack
//             </motion.span>
//           </motion.div>

//           {/* --- Desktop Navigation with Highlight --- */}
//           <div className="hidden md:flex items-center space-x-7 relative">
//             <div className="flex space-x-6 relative">
//               {navLinks.map((item) => (
//                 <motion.div
//                   key={item}
//                   className="relative"
//                   onMouseEnter={() => setHovered(item)}
//                   onMouseLeave={() => setHovered(null)}
//                 >
//                   {/* Highlight Pill */}
//                   {hovered === item && (
//                     <motion.div
//                       layoutId="navbar-glow"
//                       className="absolute inset-0 bg-gradient-to-r from-green-500/40 to-emerald-600/60 rounded-lg blur-sm z-[-1]"
//                       transition={{ type: "spring", stiffness: 540, damping: 30 }}
//                     />
//                   )}
//                   <Link
//                     to={`/${item.toLowerCase()}`}
//                     className="px-3 py-2 text-lg font-semibold rounded-lg relative z-10 transition text-gray-100 hover:text-green-400"
//                   >
//                     {item}
//                   </Link>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Auth Section Desktop */}
//             {user ? (
//               <motion.button
//                 whileTap={{ scale: 0.96 }}
//                 whileHover={{ scale: 1.12, boxShadow: "0px 1px 16px #fa5456c5" }}
//                 onClick={handleLogout}
//                 disabled={loading}
//                 className="border border-gray-700 px-6 py-2 rounded-full text-sm font-semibold hover:border-red-400 hover:text-red-400 transition-all disabled:opacity-50"
//               >
//                 {loading ? "Logging out..." : "Logout"}
//               </motion.button>
//             ) : (
//               <>
//                 <Link to="/login">
//                   <motion.button
//                     whileTap={{ scale: 0.96 }}
//                     whileHover={{ scale: 1.07, borderColor: "#99faad" }}
//                     className="border-2 border-gray-700 px-8 py-2 rounded-full text-lg font-semibold hover:border-green-300 transition-all mr-2"
//                   >
//                     Login
//                   </motion.button>
//                 </Link>
//                 <Link to="/signup">
//                   <motion.button
//                     whileTap={{ scale: 0.96 }}
//                     whileHover={{
//                       scale: 1.07,
//                       background:
//                         "linear-gradient(90deg, #1dba63 0%, #17e895 100%)",
//                     }}
//                     className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-2 rounded-full text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
//                   >
//                     Join Now
//                   </motion.button>
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* --- Mobile Menu Toggle --- */}
//           <button
//             className="md:hidden text-gray-300 hover:text-green-400"
//             onClick={() => setIsMenuOpen((v) => !v)}
//           >
//             {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
//           </button>
//         </div>

//         {/* --- Animated Mobile Dropdown --- */}
//         <AnimatePresence>
//           {isMenuOpen && (
//             <motion.div
//               key="mobileMenu"
//               initial="closed"
//               animate="open"
//               exit="closed"
//               variants={mobileMenuVariants}
//               className="md:hidden mt-4 pb-4 border-t border-gray-800 bg-black/95"
//               style={{ overflow: "hidden" }}
//             >
//               <div className="flex flex-col space-y-4 pt-4">
//                 {navLinks.map((item) => (
//                   <motion.div
//                     key={item}
//                     variants={mobileItemVariants}
//                     whileHover={{ scale: 1.06, backgroundColor: "#1dba6322" }}
//                   >
//                     <Link
//                       to={`/${item.toLowerCase()}`}
//                       className="block px-4 py-3 rounded-lg text-lg text-gray-300 hover:text-green-400 transition-colors"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       {item}
//                     </Link>
//                   </motion.div>
//                 ))}

//                 {/* Mobile Auth Section */}
//                 {user ? (
//                   <motion.button
//                     variants={mobileItemVariants}
//                     whileTap={{ scale: 0.97 }}
//                     whileHover={{ scale: 1.09, borderColor: "#fa5456" }}
//                     onClick={handleLogout}
//                     disabled={loading}
//                     className="border border-gray-700 px-6 py-2 rounded-full text-sm font-semibold hover:border-red-400 hover:text-red-400 transition-all disabled:opacity-50 mx-2"
//                   >
//                     {loading ? "Logging out..." : "Logout"}
//                   </motion.button>
//                 ) : (
//                   <>
//                     <Link to="/login" onClick={() => setIsMenuOpen(false)}>
//                       <motion.button
//                         variants={mobileItemVariants}
//                         whileTap={{ scale: 0.97 }}
//                         className="border border-gray-700 px-8 py-2 rounded-full text-lg font-semibold hover:border-green-300 transition-all mx-2"
//                       >
//                         Login
//                       </motion.button>
//                     </Link>
//                     <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
//                       <motion.button
//                         variants={mobileItemVariants}
//                         whileTap={{ scale: 0.97 }}
//                         className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-2 rounded-full text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all mx-2"
//                       >
//                         Join Now
//                       </motion.button>
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </nav>
//     </>
//   );
// };

// export default Navbar;

import React, { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="w-auto text-white flex items-center justify-between bg-black h-16 rounded-full m-3 sm:m-5 px-4 sm:px-5 relative">
        {/* Logo */}
        <div className="flex gap-1 items-center">
          <img src="./images/logo.png" alt="logo" className="h-14" />
          <h2 className="text-xl sm:text-2xl font-medium">Finzy</h2>
        </div>

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
          <button className="bg-white text-black rounded-full px-4 sm:px-6 py-1 sm:py-2 text-sm sm:text-lg font-medium hover:bg-gray-100 transition-colors duration-200">
            Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          onClick={toggleMenu}
        >
          <div
            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></div>
          <div
            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`w-5 h-0.5 bg-white transition-all duration-300 ${
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
                <button className="bg-white text-black rounded-full px-6 py-3 text-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                  Sign In
                </button>
                <button className="bg-transparent border-2 border-white text-white rounded-full px-6 py-3 text-lg font-medium hover:bg-white hover:text-black transition-all duration-200">
                  Sign Up
                </button>
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
