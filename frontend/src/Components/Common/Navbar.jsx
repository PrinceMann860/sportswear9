// src/components/Navbar.jsx
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../store/slices/auth/authSlice";
import logo from '../../assets/blacklogo.svg'
import AuthModal from "../Auth/AuthModal";
import MobileSidebar from "./MobileSidebar";
import {
  FiSearch,
  FiUser,
  FiMenu,
  FiHeart,
  FiShoppingCart,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { ShoppingBag } from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, profile } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  // NEW: track which dropdown is hovered so it doesn't flicker
  const [hoveredLink, setHoveredLink] = useState(null);

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
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full bg-[#F4EFE7] border-b border-gray-200 fixed top-0 z-50">
        <div className="px-6 lg:px-10 mx-auto flex items-center justify-between py-3 lg:py-4 h-[60px] lg:h-[80px]">
          {/* Logo + Links */}
          <div className="flex items-center gap-8">
            <button onClick={() => setOpen(true)} className="lg:hidden">
              <FiMenu size={22} />
            </button>
            <div className="text-xl font-bold tracking-tighter">
              <img src={logo} alt="" className="w-30"/>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex space-x-8 relative">
              {[
                { name: "Home", to: "/" },
                { name: "Men", to: "/men" },
                { name: "Women", to: "/women" },
                { name: "Kids", to: "/kids" },
                { name: "Sports&Lifestyle", to: "/sports" },
                { name: "Outlet", to: "/shop" },
              ].map((link) => (
                <div
                  key={link.name}
                  className="group relative"
                  // track hover on the link wrapper
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `transition hover:text-gray-600 ${
                        isActive ? "text-red-500 font-semibold" : "text-gray-900"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>

                  {/* MEN */}
                  {link.name === "Men" && (
                    <div
                      // keep hovered state when the mouse is on the dropdown itself
                      onMouseEnter={() => setHoveredLink("Men")}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={`transition-all duration-200 ease-out fixed left-0 right-0 top-[80px] z-40 bg-white border-t border-gray-200 shadow-xl ${
                        hoveredLink === "Men"
                          ? "visible opacity-100 translate-y-0 pointer-events-auto"
                          : "invisible opacity-0 translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-5 gap-10">
                        <div>
                          <h3 className="font-semibold text-red-500 mb-3 text-sm">
                            NEW & TRENDING
                          </h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-black cursor-pointer">New Drops</li>
                            <li className="hover:text-black cursor-pointer">Gym Essentials</li>
                            <li className="hover:text-black cursor-pointer">Performance Range</li>
                            <li className="hover:text-black cursor-pointer">Athleisure</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-red-500 mb-3 text-sm">TOPS</h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-black cursor-pointer">T-Shirts</li>
                            <li className="hover:text-black cursor-pointer">Stringers</li>
                            <li className="hover:text-black cursor-pointer">Oversized Tees</li>
                            <li className="hover:text-black cursor-pointer">Hoodies</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-red-500 mb-3 text-sm">BOTTOMS</h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-black cursor-pointer">Shorts</li>
                            <li className="hover:text-black cursor-pointer">Joggers</li>
                            <li className="hover:text-black cursor-pointer">Cargo Pants</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-red-500 mb-3 text-sm">ACCESSORIES</h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-black cursor-pointer">Training Bags</li>
                            <li className="hover:text-black cursor-pointer">Caps</li>
                            <li className="hover:text-black cursor-pointer">Socks</li>
                          </ul>
                        </div>

                        <div className="col-span-1 flex flex-col gap-4">
                          <div className="relative rounded-md overflow-hidden h-[150px] hover:scale-105 transition">
                            <img
                              src="https://media.istockphoto.com/id/1783827855/photo/talking-on-the-way-to-training.jpg?s=612x612&w=0&k=20&c=jrpRpIDarDFZU04wdh5l-c5SK0xKffejXcqHbJQ4ygg="
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 text-white font-semibold text-sm bg-black/40 px-2 py-1 rounded">
                              Power Collection
                            </div>
                          </div>
                          <div className="relative rounded-md overflow-hidden h-[150px] hover:scale-105 transition">
                            <img
                              src="https://hummel.net.in/cdn/shop/files/Artboard_1_copy_6_324acf56-9d3a-4856-a326-06a8d52b5d08.jpg?v=1759494799&width=400"
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 text-white font-semibold text-sm bg-black/40 px-2 py-1 rounded">
                              Athletic Fit
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WOMEN */}
                  {link.name === "Women" && (
                    <div
                      onMouseEnter={() => setHoveredLink("Women")}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={`transition-all duration-200 ease-out fixed left-0 right-0 top-[80px] z-40 bg-white border-t border-gray-200 shadow-xl ${
                        hoveredLink === "Women"
                          ? "visible opacity-100 translate-y-0 pointer-events-auto"
                          : "invisible opacity-0 translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-5 gap-10">
                        <div>
                          <h3 className="font-semibold text-red-500 mb-3 text-sm">WHAT’S HOT</h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-black cursor-pointer">New Arrivals</li>
                            <li className="hover:text-black cursor-pointer">Bestsellers</li>
                            <li className="hover:text-black cursor-pointer">Gym to Street</li>
                            <li className="hover:text-black cursor-pointer">Performance Luxe</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-red-500 mb-3 text-sm">TOPS</h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-black cursor-pointer">Crop Tops</li>
                            <li className="hover:text-black cursor-pointer">Sports Bras</li>
                            <li className="hover:text-black cursor-pointer">Oversized Tees</li>
                            <li className="hover:text-black cursor-pointer">Sweatshirts</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-red-500 mb-3 text-sm">BOTTOMS</h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-black cursor-pointer">Leggings</li>
                            <li className="hover:text-black cursor-pointer">Shorts</li>
                            <li className="hover:text-black cursor-pointer">Track Pants</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-red-500 mb-3 text-sm">ACCESSORIES</h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-black cursor-pointer">Tote Bags</li>
                            <li className="hover:text-black cursor-pointer">Headbands</li>
                            <li className="hover:text-black cursor-pointer">Water Bottles</li>
                          </ul>
                        </div>

                        <div className="col-span-1 flex flex-col gap-4">
                          <div className="relative rounded-md overflow-hidden h-[150px] hover:scale-105 transition">
                            <img
                              src="https://i.pinimg.com/736x/29/63/0c/29630ce63c84d033dabde652f3e49664.jpg"
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 text-white font-semibold text-sm bg-black/40 px-2 py-1 rounded">
                              Seamless Collection
                            </div>
                          </div>
                          <div className="relative rounded-md overflow-hidden h-[150px] hover:scale-105 transition">
                            <img
                              src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/woman-sports-wear-fashion-sale-shop-store-ad-design-template-8843cd2ac8f9fcd7d9911d3afd7a3e10_screen.jpg?ts=1735477277"
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 text-white font-semibold text-sm bg-black/40 px-2 py-1 rounded">
                              Power Shorts
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* KIDS */}
                  {link.name === "Kids" && (
                    <div
                      onMouseEnter={() => setHoveredLink("Kids")}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={`transition-all duration-200 ease-out fixed left-0 right-0 top-[80px] z-40 bg-white border-t border-gray-200 shadow-xl ${
                        hoveredLink === "Kids"
                          ? "visible opacity-100 translate-y-0 pointer-events-auto"
                          : "invisible opacity-0 translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-5 gap-10">
                        <div>
                          <h3 className="font-semibold text-red-500 mb-3 text-sm">TRENDING</h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-black cursor-pointer">New In</li>
                            <li className="hover:text-black cursor-pointer">Mini Athletes</li>
                            <li className="hover:text-black cursor-pointer">Playwear</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-red-500 mb-3 text-sm">TOPS</h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-black cursor-pointer">T-Shirts</li>
                            <li className="hover:text-black cursor-pointer">Sweatshirts</li>
                            <li className="hover:text-black cursor-pointer">Hoodies</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-red-500 mb-3 text-sm">BOTTOMS</h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-black cursor-pointer">Joggers</li>
                            <li className="hover:text-black cursor-pointer">Shorts</li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold text-red-500 mb-3 text-sm">ACCESSORIES</h3>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="hover:text-black cursor-pointer">Bags</li>
                            <li className="hover:text-black cursor-pointer">Caps</li>
                            <li className="hover:text-black cursor-pointer">Socks</li>
                          </ul>
                        </div>

                        <div className="col-span-1 flex flex-col gap-4">
                          <div className="relative rounded-md overflow-hidden h-[150px] hover:scale-105 transition">
                            <img
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL1hDiO-P1vrcDxseQT-E0Q9GD8tlIBEIX7jLQ4HCNWPgJ16iqusa6ZWdFnMxRJhTy-ac&usqp=CAU"
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 text-white font-semibold text-sm bg-black/40 px-2 py-1 rounded">
                              Play Hard
                            </div>
                          </div>
                          <div className="relative rounded-md overflow-hidden h-[150px] hover:scale-105 transition">
                            <img
                              src="https://www.buffalolib.org/sites/default/files/styles/branch_image/public/inline-images/heading/Kids-Sports-Page-Banner.jpg?itok=yUAz0htp"
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 text-white font-semibold text-sm bg-black/40 px-2 py-1 rounded">
                              Everyday Comfort
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:text-red-500 transition"
                >
                  <FiUser className="text-lg" />
                  <span className="text-sm font-medium">{profile?.full_name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    <button
                      onClick={() => {
                        dispatch(logout());
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthOpen(true);
                }}
              >
                <FiUser className="text-lg cursor-pointer hover:text-red-500" />
              </button>
            )}

            <FiHeart className="text-lg cursor-pointer hover:text-red-500" />
            <FiShoppingCart className="text-lg cursor-pointer hover:text-red-500" />
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-4">
            <FiSearch size={20} className="cursor-pointer" onClick={() => setShowSearch(true)} />
            <Link>
              <ShoppingBag className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar isOpen={open} onClose={() => setOpen(false)} />

        {/* Mobile Search */}
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
              <FiX size={24} className="ml-3 cursor-pointer" onClick={() => setShowSearch(false)} />
            </div>

            <div className="space-y-3">
              {suggestions
                .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((s, i) => (
                  <div key={i} className="p-2 border-b cursor-pointer hover:bg-gray-100" onClick={() => setSearchQuery(s)}>
                    {s}
                  </div>
                ))}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {authOpen && <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} mode={authMode} setMode={setAuthMode} />}
    </>
  );
}

export default Navbar;
