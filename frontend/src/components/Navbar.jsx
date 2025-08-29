import React, { useState } from "react";
import { Wallet, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-white px-6 py-4 fixed w-full top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-wide text-white">
            FinTrack
          </span>
        </div>

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
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2 rounded-full hover:opacity-90 transition font-semibold shadow-md">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300 hover:text-green-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2 rounded-full hover:opacity-90 transition w-fit font-semibold shadow-md">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
