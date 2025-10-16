import { useState } from "react";
import { Home as Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { logout } from "../../store/slices/auth/authSlice";
import { FiLogOut } from "react-icons/fi";
import AuthModal from "../Auth/AuthModal";

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
              className={`${isActive("/") ? "text-blue-600" : "text-gray-600"} transition-colors`}
              strokeWidth={isActive("/") ? 2.5 : 2}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                isActive("/") ? "text-blue-600" : "text-gray-600"
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
              className={`${isActive("/categories") ? "text-blue-600" : "text-gray-600"} transition-colors`}
              strokeWidth={isActive("/categories") ? 2.5 : 2}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                isActive("/categories") ? "text-blue-600" : "text-gray-600"
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
              className={`${isActive("/wishlist") ? "text-blue-600" : "text-gray-600"} transition-colors`}
              strokeWidth={isActive("/wishlist") ? 2.5 : 2}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                isActive("/wishlist") ? "text-blue-600" : "text-gray-600"
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
              className={`${isActive("/orders") ? "text-blue-600" : "text-gray-600"} transition-colors`}
              strokeWidth={isActive("/orders") ? 2.5 : 2}
            />
            <span
              className={`text-[10px] mt-1 font-medium ${
                isActive("/orders") ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Orders
            </span>
          </button>

          {/* Profile */}
          {isAuthenticated ? (
            <div className="relative flex flex-col items-center justify-center flex-1 h-full">
              <button
                onClick={() => navigate("/profile")}
                className="flex flex-col items-center justify-center"
              >
                <User
                  size={22}
                  className={`${isActive("/profile") ? "text-blue-600" : "text-gray-600"} transition-colors`}
                  strokeWidth={isActive("/profile") ? 2.5 : 2}
                />
                <span className={`text-[10px] mt-1 font-medium ${
                  isActive("/profile") ? "text-blue-600" : "text-gray-600"
                }`}>
                  {profile?.full_name?.split(" ")[0] || "Profile"}
                </span>
              </button>
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
                className="text-gray-600 hover:text-blue-600 transition-colors"
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
