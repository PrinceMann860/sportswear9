import React from "react";
import { useState } from "react";
import {
  FiSearch,
  FiUser,
  FiMenu,
  FiHeart,
  FiShoppingCart,
} from "react-icons/fi";
import { FiX } from "react-icons/fi";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-[#F4EFE7] border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 lg:py-4">
        <div className="w-[50%] flex">
          {/* Logo */}
          <div className="text-xl font-bold tracking-tighter">
            SPORTSWEAR9
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex space-x-8 mx-auto">
            {["Home", "Shop", "Help"].map((item) => (
              <a key={item} href="#" className="hover:text-gray-600 transition">
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Search + Icons */}
        <div className="w-[50%] hidden lg:flex items-center space-x-5">
          <div className="relative mx-auto">
            <input
              type="text"
              placeholder="Search here..."
              className="w-[400px] pl-4 pr-8 py-1 rounded-full border border-gray-700 focus:outline-none"
            />
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
          <FiUser className="text-lg cursor-pointer" />
          <FiHeart className="text-lg cursor-pointer" />
          <FiShoppingCart className="text-lg cursor-pointer" />
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="lg:hidden flex flex-col px-6 pb-4 space-y-3 text-sm">
          {["Home", "Shop", "Help"].map((item) => (
            <a key={item} href="#" className="py-1 border-b border-gray-200">
              {item}
            </a>
          ))}

          
          <div className="flex items-center space-x-4 pt-2">
            <FiUser className="text-lg cursor-pointer" />
            <FiHeart className="text-lg cursor-pointer" />
            <FiShoppingCart className="text-lg cursor-pointer" />
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
