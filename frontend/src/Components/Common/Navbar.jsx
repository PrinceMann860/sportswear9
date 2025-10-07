import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import AuthModal from "../Auth/Authmodal";
import {
  FiSearch,
  FiUser,
  FiMenu,
  FiHeart,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";

function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup"); // default to signup
  const [open, setOpen] = useState(false); // mobile menu
  const [showSearch, setShowSearch] = useState(false); // mobile search full page
  const [searchQuery, setSearchQuery] = useState("");

  const suggestions = [
    "Running shoes",
    "Football jersey",
    "Yoga pants",
    "Winter jackets",
    "Sneakers",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // navigate or call API
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full bg-[#F4EFE7] border-b border-gray-200 fixed top-0 z-50">
        <div className="px-6 lg:px-10 mx-auto flex items-center justify-between py-3 lg:py-4 h-[60px]">
          {/* Logo + Links */}
          <div className="flex items-center gap-8">
            <div className="text-xl font-bold tracking-tighter">
              SPORTSWEAR<span className="text-red-500">9</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex space-x-8">
              {[
                { name: "Home", to: "/" },
                { name: "Men", to: "/men" },
                { name: "Women", to: "/women" },
                { name: "Kids", to: "/kids" },
                { name: "Sports&Lifestyle", to: "/sports" },
                { name: "Outlet", to: "/shop" },
              ].map((link) => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className={({ isActive }) =>
                    `transition hover:text-gray-600 ${
                      isActive
                        ? "text-red-500 font-semibold"
                        : "text-gray-900"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Desktop Search + Icons */}
          <div className="hidden lg:flex items-center space-x-5">
            <form className="relative" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[350px] pl-4 pr-8 py-1 border border-gray-700 focus:outline-none"
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </form>

            {/* USER ICON - opens signup modal */}
            <button
              onClick={() => {
                setAuthMode("signup");
                setAuthOpen(true);
              }}
            >
              <FiUser className="text-lg cursor-pointer hover:text-red-500" />
            </button>

            <FiHeart className="text-lg cursor-pointer hover:text-red-500" />
            <FiShoppingCart className="text-lg cursor-pointer hover:text-red-500" />
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-4">
            <FiSearch
              size={20}
              className="cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
            <button onClick={() => setOpen(true)}>
              <FiMenu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Full Page Menu */}
        {open && (
          <div
            className={`fixed inset-0 bg-white z-50 flex flex-col p-6 transform transition-transform duration-700 ease-in-out ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="text-xl font-bold">Menu</div>
              <FiX
                size={24}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>

            <div className="flex flex-col space-y-6 text-lg">
              {[
                "Home",
                "Men",
                "Women",
                "Kids",
                "Sports&Lifestyle",
                "Outlet",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="hover:text-red-500 transition"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="mt-auto flex items-center space-x-6 pt-10 border-t">
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setAuthOpen(true);
                }}
              >
                <FiUser className="text-2xl hover:text-red-500" />
              </button>
              <FiHeart className="text-2xl cursor-pointer hover:text-red-500" />
              <FiShoppingCart className="text-2xl cursor-pointer hover:text-red-500" />
            </div>
          </div>
        )}

        {/* Mobile Full Page Search */}
        {showSearch && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col p-6">
            <div className="flex items-center mb-6">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-400 rounded focus:outline-none"
                autoFocus
              />
              <FiX
                size={24}
                className="ml-3 cursor-pointer"
                onClick={() => setShowSearch(false)}
              />
            </div>

            {/* Suggestions */}
            <div className="space-y-3">
              {suggestions
                .filter((s) =>
                  s.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((s, i) => (
                  <div
                    key={i}
                    className="p-2 border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => setSearchQuery(s)}
                  >
                    {s}
                  </div>
                ))}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {authOpen && (
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          mode={authMode}
          setMode={setAuthMode}
        />
      )}
    </>
  );
}

export default Navbar;
