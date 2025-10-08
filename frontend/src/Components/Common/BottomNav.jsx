import { useState } from "react";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../store/slices/auth/authSlice";
import AuthModal from "../Auth/AuthModal";
import { FiLogOut } from "react-icons/fi";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, profile } = useAuth();

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex justify-around items-center h-16 relative">

          {/* Home */}
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center justify-center flex-1 h-full active:bg-gray-50 transition-colors"
          >
            <Home
              size={22}
              className={`${isActive("/") ? "text-red-500" : "text-gray-600"} transition-colors`}
              strokeWidth={isActive("/") ? 2.5 : 2}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                isActive("/") ? "text-red-500" : "text-gray-600"
              }`}
            >
              Home
            </span>
          </button>

          {/* Explore */}
          <button
            onClick={() => navigate("/categories")}
            className="flex flex-col items-center justify-center flex-1 h-full active:bg-gray-50 transition-colors"
          >
            <Search
              size={22}
              className={`${isActive("/categories") ? "text-red-500" : "text-gray-600"} transition-colors`}
              strokeWidth={isActive("/categories") ? 2.5 : 2}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                isActive("/categories") ? "text-red-500" : "text-gray-600"
              }`}
            >
              Explore
            </span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => navigate("/wishlist")}
            className="flex flex-col items-center justify-center flex-1 h-full active:bg-gray-50 transition-colors"
          >
            <Heart
              size={22}
              className={`${isActive("/wishlist") ? "text-red-500" : "text-gray-600"} transition-colors`}
              strokeWidth={isActive("/wishlist") ? 2.5 : 2}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                isActive("/wishlist") ? "text-red-500" : "text-gray-600"
              }`}
            >
              Wishlist
            </span>
          </button>

          {/* orders */}
          <button
            onClick={() => navigate("/orders")}
            className="flex flex-col items-center justify-center flex-1 h-full active:bg-gray-50 transition-colors"
          >
            <ShoppingBag
              size={22}
              className={`${isActive("/cart") ? "text-red-500" : "text-gray-600"} transition-colors`}
              strokeWidth={isActive("/cart") ? 2.5 : 2}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                isActive("/cart") ? "text-red-500" : "text-gray-600"
              }`}
            >
              Orders
            </span>
          </button>

          {/* Profile */}
          {isAuthenticated ? (
            <div className="relative flex flex-col items-center justify-center flex-1 h-full">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex flex-col items-center justify-center"
              >
                <User
                  size={22}
                  className={`${
                    showUserMenu ? "text-red-500" : "text-gray-600"
                  } transition-colors`}
                  strokeWidth={showUserMenu ? 2.5 : 2}
                />
                <span className="text-[10px] mt-1 font-medium text-gray-700">
                  {profile?.full_name?.split(" ")[0] || "Profile"}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute bottom-16 right-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  <button
                    onClick={() => {
                      dispatch(logout());
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="flex flex-col items-center justify-center flex-1 h-full active:bg-gray-50 transition-colors"
              onClick={() => {
                setAuthMode("login");
                setAuthOpen(true);
              }}
            >
              <User
                size={22}
                className="text-gray-600 hover:text-red-500 transition-colors"
              />
              <span className="text-[10px] mt-1 font-medium text-gray-600">
                Profile
              </span>
            </button>
          )}
        </div>
      </div>

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
};

export default BottomNav;
