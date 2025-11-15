import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../store/slices/auth/authSlice";
import logo from "../../assets/blacklogo.png";
import AuthModal from "../Auth/AuthModal";
import MobileSidebar from "./MobileSidebar";
import { User, Package } from "lucide-react";
import {
  FiSearch,
  FiUser,
  FiMenu,
  FiHeart,
  FiShoppingCart,
  FiX,
  FiLogOut,
  FiClock,
} from "react-icons/fi";
import { ShoppingBag } from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const navRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const suggestions = [
    "Running shoes",
    "Football jersey",
    "Yoga pants",
    "Winter jackets",
    "Sneakers",
    "Basketball shorts",
    "Training gloves",
    "Sports bags",
  ];

  const placeholders = [
    "Running shoes",
    "Football jersey",
    "Yoga pants",
    "Winter jackets",
    "Sneakers",
    "Basketball shorts",
    "Training gloves",
    "Sports bags",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch, showUserMenu]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleMouseLeaveNav = () => {
    setHoveredLink(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categories?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    navigate(`/categories?q=${encodeURIComponent(suggestion)}`);
    setSearchQuery("");
    setShowSearch(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .search-shadow {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>

      {/* NAVBAR */}
      <nav
        ref={navRef}
        className="w-full bg-white border-b border-gray-200 fixed top-0 z-50 shadow-lg"
        onMouseLeave={handleMouseLeaveNav}
      >
        <div className="px-4 md:px-6 lg:px-10 mx-auto flex items-center justify-between py-3 lg:py-4 h-[60px] lg:h-[80px]">
          {/* Logo + Links */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setOpen(true)}
              className="xl:hidden hover:bg-gray-200 p-2 rounded-md transition-colors"
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </button>
            <Link
              to="/"
              className="text-xl font-bold tracking-tighter flex-shrink-0"
            >
              <img
                src={logo}
                alt="Brand Logo"
                className="w-24 md:w-28 lg:w-30 h-auto"
              />
            </Link>

            {/* Desktop Links */}
            <div className="hidden xl:flex space-x-4 relative">
              {[
                { name: "Men Collection", to: "/product/men" },
                { name: "Women Collection", to: "/product/women" },
                { name: "Kids Collection", to: "/product/kids" },
                { name: "SwimWear", to: "/product/swimwear" },
                { name: "Flash Clearance Sale", to: "/product/clearance" },
                { name: "New Arrivals", to: "/product/new-arrivals" },
                { name: "Accessories", to: "/product/accessories" },
                { name: "Contact", to: "/contact" },
              ].map((link) => (
                <div
                  key={link.name}
                  className="group relative"
                  onMouseEnter={() => setHoveredLink(link.name)}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `text-sm 2xl:text-base transition-all duration-200 hover:text-blue-600 relative pb-1 ${
                        isActive
                          ? "text-blue-600 font-semibold"
                          : "text-gray-900"
                      }`
                    }
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-[-25px] left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </NavLink>

                  {/* MEN */}
                  {link.name === "Men Collection" && (
                    <div
                      onMouseEnter={() => setHoveredLink("Men Collection")}
                      className={`transition-all duration-300 ease-out fixed left-0 right-0 top-[60px] lg:top-[80px] z-40 bg-white border-t border-gray-200 shadow-2xl ${
                        hoveredLink === "Men Collection"
                          ? "visible opacity-100 translate-y-0 pointer-events-auto"
                          : "invisible opacity-0 -translate-y-4 pointer-events-none"
                      }`}
                    >
                      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-5 gap-6 lg:gap-10">
                        <div>
                          <h3 className="font-bold text-blue-600 mb-4 text-xs tracking-wider">
                            NEW & TRENDING
                          </h3>
                          <ul className="space-y-2.5 text-sm text-gray-600">
                            <Link to="/product/men/new-drops">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                New Drops
                              </li>
                            </Link>
                            <Link to="/product/men/gym-essentials">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Gym Essentials
                              </li>
                            </Link>
                            <Link to="/product/men/performance-range">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Performance Range
                              </li>
                            </Link>
                            <Link to="/product/men/athleisure">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Athleisure
                              </li>
                            </Link>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold text-blue-600 mb-4 text-xs tracking-wider">
                            TOPS
                          </h3>
                          <ul className="space-y-2.5 text-sm text-gray-600">
                            <Link to="/product/men/t-shirts">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                T-Shirts
                              </li>
                            </Link>
                            <Link to="/product/men/stringers">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Stringers
                              </li>
                            </Link>
                            <Link to="/product/men/oversized-tees">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Oversized Tees
                              </li>
                            </Link>
                            <Link to="/product/men/hoodies">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Hoodies
                              </li>
                            </Link>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold text-blue-600 mb-4 text-xs tracking-wider">
                            BOTTOMS
                          </h3>
                          <ul className="space-y-2.5 text-sm text-gray-600">
                            <Link to="/product/men/shorts">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Shorts
                              </li>
                            </Link>
                            <Link to="/product/men/joggers">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Joggers
                              </li>
                            </Link>
                            <Link to="/product/men/cargo-pants">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Cargo Pants
                              </li>
                            </Link>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold text-blue-600 mb-4 text-xs tracking-wider">
                            ACCESSORIES
                          </h3>
                          <ul className="space-y-2.5 text-sm text-gray-600">
                            <Link to="/product/men/training-bags">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Training Bags
                              </li>
                            </Link>
                            <Link to="/product/men/caps">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Caps
                              </li>
                            </Link>
                            <Link to="/product/men/socks">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Socks
                              </li>
                            </Link>
                          </ul>
                        </div>

                        <div className="col-span-1 flex flex-col gap-4">
                          <Link to="/product/men/power-collection">
                            <div className="relative rounded-lg overflow-hidden h-[150px] hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl">
                              <img
                                src="https://media.istockphoto.com/id/1783827855/photo/talking-on-the-way-to-training.jpg?s=612x612&w=0&k=20&c=jrpRpIDarDFZU04wdh5l-c5SK0xKffejXcqHbJQ4ygg="
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 left-2 text-white font-semibold text-sm bg-black/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
                                Power Collection
                              </div>
                            </div>
                          </Link>
                          <Link to="/product/men/athletic-fit">
                            <div className="relative rounded-lg overflow-hidden h-[150px] hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl">
                              <img
                                src="https://hummel.net.in/cdn/shop/files/Artboard_1_copy_6_324acf56-9d3a-4856-a326-06a8d52b5d08.jpg?v=1759494799&width=400"
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 left-2 text-white font-semibold text-sm bg-black/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
                                Athletic Fit
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WOMEN */}
                  {link.name === "Women Collection" && (
                    <div
                      onMouseEnter={() => setHoveredLink("Women Collection")}
                      className={`transition-all duration-300 ease-out fixed left-0 right-0 top-[60px] lg:top-[80px] z-40 bg-white border-t border-gray-200 shadow-2xl ${
                        hoveredLink === "Women Collection"
                          ? "visible opacity-100 translate-y-0 pointer-events-auto"
                          : "invisible opacity-0 -translate-y-4 pointer-events-none"
                      }`}
                    >
                      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-5 gap-6 lg:gap-10">
                        <div>
                          <h3 className="font-bold text-blue-600 mb-4 text-xs tracking-wider">
                            WHAT'S HOT
                          </h3>
                          <ul className="space-y-2.5 text-sm text-gray-600">
                            <Link to="/product/women/new-arrivals">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                New Arrivals
                              </li>
                            </Link>
                            <Link to="/product/women/bestsellers">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Bestsellers
                              </li>
                            </Link>
                            <Link to="/product/women/gym-to-street">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Gym to Street
                              </li>
                            </Link>
                            <Link to="/product/women/performance-luxe">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Performance Luxe
                              </li>
                            </Link>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold text-blue-600 mb-4 text-xs tracking-wider">
                            TOPS
                          </h3>
                          <ul className="space-y-2.5 text-sm text-gray-600">
                            <Link to="/product/women/crop-tops">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Crop Tops
                              </li>
                            </Link>
                            <Link to="/product/women/sports-bras">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Sports Bras
                              </li>
                            </Link>
                            <Link to="/product/women/oversized-tees">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Oversized Tees
                              </li>
                            </Link>
                            <Link to="/product/women/sweatshirts">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Sweatshirts
                              </li>
                            </Link>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold text-blue-600 mb-4 text-xs tracking-wider">
                            BOTTOMS
                          </h3>
                          <ul className="space-y-2.5 text-sm text-gray-600">
                            <Link to="/product/women/leggings">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Leggings
                              </li>
                            </Link>
                            <Link to="/product/women/shorts">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Shorts
                              </li>
                            </Link>
                            <Link to="/product/women/track-pants">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Track Pants
                              </li>
                            </Link>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold text-blue-600 mb-4 text-xs tracking-wider">
                            ACCESSORIES
                          </h3>
                          <ul className="space-y-2.5 text-sm text-gray-600">
                            <Link to="/product/women/tote-bags">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Tote Bags
                              </li>
                            </Link>
                            <Link to="/product/women/headbands">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Headbands
                              </li>
                            </Link>
                            <Link to="/product/women/water-bottles">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Water Bottles
                              </li>
                            </Link>
                          </ul>
                        </div>

                        <div className="col-span-1 flex flex-col gap-4">
                          <Link to="/product/women/seamless-collection">
                            <div className="relative rounded-lg overflow-hidden h-[150px] hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl">
                              <img
                                src="https://i.pinimg.com/736x/29/63/0c/29630ce63c84d033dabde652f3e49664.jpg"
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 left-2 text-white font-semibold text-sm bg-black/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
                                Seamless Collection
                              </div>
                            </div>
                          </Link>
                          <Link to="/product/women/power-shorts">
                            <div className="relative rounded-lg overflow-hidden h-[150px] hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl">
                              <img
                                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/woman-sports-wear-fashion-sale-shop-store-ad-design-template-8843cd2ac8f9fcd7d9911d3afd7a3e10_screen.jpg?ts=1735477277"
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 left-2 text-white font-semibold text-sm bg-black/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
                                Power Shorts
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* KIDS */}
                  {link.name === "Kids Collection" && (
                    <div
                      onMouseEnter={() => setHoveredLink("Kids Collection")}
                      className={`transition-all duration-300 ease-out fixed left-0 right-0 top-[60px] lg:top-[80px] z-40 bg-white border-t border-gray-200 shadow-2xl ${
                        hoveredLink === "Kids Collection"
                          ? "visible opacity-100 translate-y-0 pointer-events-auto"
                          : "invisible opacity-0 -translate-y-4 pointer-events-none"
                      }`}
                    >
                      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-5 gap-6 lg:gap-10">
                        <div>
                          <h3 className="font-bold text-blue-600 mb-4 text-xs tracking-wider">
                            TRENDING
                          </h3>
                          <ul className="space-y-2.5 text-sm text-gray-600">
                            <Link to="/product/kids/new-in">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                New In
                              </li>
                            </Link>
                            <Link to="/product/kids/mini-athletes">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Mini Athletes
                              </li>
                            </Link>
                            <Link to="/product/kids/playwear">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Playwear
                              </li>
                            </Link>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold text-blue-600 mb-4 text-xs tracking-wider">
                            TOPS
                          </h3>
                          <ul className="space-y-2.5 text-sm text-gray-600">
                            <Link to="/product/kids/t-shirts">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                T-Shirts
                              </li>
                            </Link>
                            <Link to="/product/kids/sweatshirts">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Sweatshirts
                              </li>
                            </Link>
                            <Link to="/product/kids/hoodies">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Hoodies
                              </li>
                            </Link>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold text-blue-600 mb-4 text-xs tracking-wider">
                            BOTTOMS
                          </h3>
                          <ul className="space-y-2.5 text-sm text-gray-600">
                            <Link to="/product/kids/joggers">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Joggers
                              </li>
                            </Link>
                            <Link to="/product/kids/shorts">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Shorts
                              </li>
                            </Link>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-bold text-blue-600 mb-4 text-xs tracking-wider">
                            ACCESSORIES
                          </h3>
                          <ul className="space-y-2.5 text-sm text-gray-600">
                            <Link to="/product/kids/bags">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Bags
                              </li>
                            </Link>
                            <Link to="/product/kids/caps">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Caps
                              </li>
                            </Link>
                            <Link to="/product/kids/socks">
                              <li className="hover:text-blue-600 hover:translate-x-1 transition-all duration-200 cursor-pointer">
                                Socks
                              </li>
                            </Link>
                          </ul>
                        </div>

                        <div className="col-span-1 flex flex-col gap-4">
                          <Link to="/product/kids/play-hard">
                            <div className="relative rounded-lg overflow-hidden h-[150px] hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl">
                              <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL1hDiO-P1vrcDxseQT-E0Q9GD8tlIBEIX7jLQ4HCNWPgJ16iqusa6ZWdFnMxRJhTy-ac&usqp=CAU"
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 left-2 text-white font-semibold text-sm bg-black/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
                                Play Hard
                              </div>
                            </div>
                          </Link>
                          <Link to="/product/kids/everyday-comfort">
                            <div className="relative rounded-lg overflow-hidden h-[150px] hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl">
                              <img
                                src="https://www.buffalolib.org/sites/default/files/styles/branch_image/public/inline-images/heading/Kids-Sports-Page-Banner.jpg?itok=yUAz0htp"
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 left-2 text-white font-semibold text-sm bg-black/50 px-3 py-1.5 rounded-md backdrop-blur-sm">
                                Everyday Comfort
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Search + Icons */}
          <div className="hidden lg:flex items-center lg:space-x-3">
            {/* Apple-style Search Dropdown */}
            <div className="search-container relative" ref={searchContainerRef}>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center hover:bg-blue-100 px-2 py-2 rounded-full transition-all duration-200 group"
                aria-label="Search"
              >
                <FiSearch
                  className="text-gray-500 hover:text-blue-500 transition-colors"
                  size={16}
                />
              </button>

              {/* Search Dropdown */}
              {showSearch && (
                <div className="transition-all duration-300 ease-out fixed left-0 right-0 top-[60px] lg:top-[80px] z-40 bg-white border-t border-gray-200 shadow-2xl">
                  {/* Search Input */}
                  <div className="p-3 border-b border-gray-100 max-w-6xl mx-auto">
                    <div className="relative">
                      <FiSearch
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search for ${placeholders[currentPlaceholder]}`}
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setShowSearch(false);
                          if (e.key === "Enter") handleSearch(e);
                        }}
                      />
                      {searchQuery && (
                        <button
                          onClick={clearSearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <FiX
                            className="text-gray-400 hover:text-gray-600"
                            size={16}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="max-h-80 overflow-y-auto max-w-6xl mx-auto">
                    {/* Search Suggestions */}
                    {searchQuery && (
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Suggestions
                        </div>
                        {suggestions
                          .filter((suggestion) =>
                            suggestion
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          )
                          .slice(0, 6)
                          .map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 group"
                            >
                              <FiSearch
                                className="text-gray-400 group-hover:text-blue-600 transition-colors"
                                size={16}
                              />
                              <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                                {suggestion}
                              </span>
                            </button>
                          ))}

                        {/* No Results */}
                        {suggestions.filter((suggestion) =>
                          suggestion
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        ).length === 0 && (
                          <div className="px-3 py-8 text-center text-gray-500">
                            <FiSearch
                              className="mx-auto mb-2 text-gray-300"
                              size={24}
                            />
                            <p>No results found for "{searchQuery}"</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick Actions */}
                    {!searchQuery && (
                      <div className="p-2 border-t border-gray-100">
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Quick Links
                        </div>
                        <button
                          onClick={() => handleSuggestionClick("New Arrivals")}
                          className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          🆕 New Arrivals
                        </button>
                        <button
                          onClick={() =>
                            handleSuggestionClick("Clearance Sale")
                          }
                          className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          🔥 Clearance Sale
                        </button>
                        <button
                          onClick={() => handleSuggestionClick("Best Sellers")}
                          className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          ⭐ Best Sellers
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:text-blue-600 transition-all duration-200 p-2 rounded-full hover:bg-blue-50"
                >
                  <FiUser className="text-lg" />
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {profile?.full_name}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl py-3 animate-slideIn z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {profile?.full_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {profile?.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors rounded-lg mx-1"
                    >
                      <User size={18} className="text-blue-500" />
                      <span className="font-medium">My Profile</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors rounded-lg mx-1"
                    >
                      <FiHeart size={18} className="text-pink-500" />
                      <span className="font-medium">Wishlist</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors rounded-lg mx-1"
                    >
                      <Package size={18} className="text-green-500" />
                      <span className="font-medium">My Orders</span>
                    </Link>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors rounded-lg mx-1"
                      >
                        <FiLogOut size={18} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthOpen(true);
                }}
                className="p-2 rounded-full hover:bg-blue-50 transition-colors"
                aria-label="Login"
              >
                <FiUser className="text-lg cursor-pointer hover:text-blue-600 transition-colors" />
              </button>
            )}

            <Link
              to="/wishlist"
              className="p-2 rounded-full hover:bg-blue-50 transition-colors"
              aria-label="Wishlist"
            >
              <FiHeart className="text-lg cursor-pointer hover:text-blue-600 transition-colors" />
            </Link>
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-blue-50 transition-colors"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="text-lg cursor-pointer hover:text-blue-600 transition-colors" />
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-3">
            <Link to={"/categories"}>
              <button
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Search"
              >
                <FiSearch size={20} className="cursor-pointer" />
              </button>
            </Link>
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="cursor-pointer" size={20} />
            </Link>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={open}
          onClose={() => setOpen(false)}
          openAuthModal={(mode) => {
            setAuthMode(mode);
            setAuthOpen(true);
          }}
        />
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
