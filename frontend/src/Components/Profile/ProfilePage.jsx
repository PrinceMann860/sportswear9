import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Edit3,
  MapPin,
  Heart,
  CreditCard,
  Settings,
  LogOut,
  Package,
  Star,
  Import,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/auth/authSlice";
import { Link } from "react-router-dom";

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (profileData) => {
  const fields = [
    profileData.fullName,
    profileData.email,
    profileData.phone,
    profileData.dateOfBirth,
    profileData.gender,
    profileData.address.street,
    profileData.address.city,
    profileData.address.state,
    profileData.address.pincode,
  ];

  const filledFields = fields.filter(
    (field) => field && field.trim() !== ""
  ).length;
  return Math.round((filledFields / fields.length) * 100);
};

const ProfilePage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google && document.getElementById("googleSignInDiv")) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response) => {
          // handle login success from Google
          console.log("Google Login Success:", response);
          navigate("/profile");
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", width: "250" }
      );
    }
  }, []);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  // Initialize profile data when user data is available
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "+91 9876543210",
        dateOfBirth: user.date_of_birth || "1990-01-15",
        gender: user.gender || "Male",
        address: {
          street: user.address?.street || "123 Main Street",
          city: user.address?.city || "Mumbai",
          state: user.address?.state || "Maharashtra",
          pincode: user.address?.pincode || "400001",
          country: user.address?.country || "India",
        },
      });
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saving profile data:", profileData);
    // You can add an API call here to update user profile
  };

  const menuItems = [
    {
      id: "profile",
      label: "Profile Info",
      icon: User,
      color: "text-blue-500",
    },
    {
      id: "orders",
      label: "My Orders",
      icon: Package,
      color: "text-green-500",
    },
    { id: "wishlist", label: "Wishlist", icon: Heart, color: "text-pink-500" },
    {
      id: "addresses",
      label: "Addresses",
      icon: MapPin,
      color: "text-purple-500",
    },
    {
      id: "payments",
      label: "Payment Methods",
      icon: CreditCard,
      color: "text-orange-500",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      color: "text-gray-500",
    },
  ];

  // ✅ NEW: handle global loading state safely
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <p className="text-gray-500 mt-6">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // When user not logged in
if (!isAuthenticated) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center pt-16 md:pt-20 pb-16 md:pb-0">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-4">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <User size={40} className="text-blue-500" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Please Login</h2>
        <p className="text-gray-600 mb-6">You need to login to access your profile</p>
        {/* 👇 same login button as Navbar */}
        <div id="googleSignInDiv" className="flex justify-center"></div>
      </div>
    </div>
  );
}


  // ✅ if user data still null but authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <p className="text-gray-500 mt-6">Fetching your details...</p>
        </div>
      </div>
    );
  }

  // ✅ main UI after everything is ready
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-16 md:pt-20 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-white rounded-2xl shadow-xl p-6 h-fit border border-blue-100">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                {user.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 truncate">
                  {profileData.fullName || user.full_name || "User"}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {profileData.email || user.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500">
                    {user.membership_type || "Premium Member"}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border border-blue-200 shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activeTab === item.id
                        ? "bg-blue-100"
                        : "bg-gray-100 group-hover:bg-blue-100"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 text-red-600 hover:bg-red-50 hover:shadow-sm group"
              >
                <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            </nav>

            {/* Profile Completion */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">
                  Profile Completion
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {calculateProfileCompletion(profileData)}%
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${calculateProfileCompletion(profileData)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-blue-100">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Profile Information
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Manage your personal information and preferences
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      isEditing ? handleSave() : setIsEditing(true)
                    }
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-4 sm:mt-0"
                  >
                    <Edit3 className="w-4 h-4" />
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <InputField
                    label="Full Name"
                    value={profileData.fullName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        fullName: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    variant="blue"
                  />
                  <InputField
                    label="Email"
                    value={profileData.email}
                    disabled
                    variant="gray"
                  />
                  <InputField
                    label="Phone"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    variant="blue"
                  />
                  <InputField
                    label="Date of Birth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        dateOfBirth: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    variant="blue"
                  />
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <label className="block text-sm font-semibold text-blue-900 mb-3">
                      Gender
                    </label>
                    <select
                      value={profileData.gender}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          gender: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-blue-100 text-gray-900 transition-all duration-300"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                </div>

                {/* Address Section */}
                <div className="mt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-blue-500" />
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      Address Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {["street", "city", "state", "pincode", "country"].map(
                      (field) => (
                        <InputField
                          key={field}
                          label={field.charAt(0).toUpperCase() + field.slice(1)}
                          value={profileData.address[field]}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              address: {
                                ...profileData.address,
                                [field]: e.target.value,
                              },
                            })
                          }
                          disabled={!isEditing}
                          variant="blue"
                          full={field === "street"}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === "orders" && (
              <EmptyTab
                icon={Package}
                color="text-blue-400"
                title="No orders found"
                subtitle="Start shopping to see your orders here"
              />
            )}

            {/* Wishlist */}
            {activeTab === "wishlist" && (
              <EmptyTab
                icon={Heart}
                color="text-pink-400"
                title="Your wishlist is empty"
                subtitle="Add items you love to see them here"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// ✅ small reusable input component
const InputField = ({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  variant = "blue",
  full,
}) => {
  const baseColor = variant === "blue" ? "blue" : "gray";
  const bg = variant === "blue" ? "bg-blue-50" : "bg-gray-50";
  const border = variant === "blue" ? "border-blue-200" : "border-gray-200";

  return (
    <div
      className={`${bg} p-4 rounded-xl border ${border} ${
        full ? "md:col-span-2" : ""
      }`}
    >
      <label
        className={`block text-sm font-semibold text-${baseColor}-900 mb-3`}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 border border-${baseColor}-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${baseColor}-500 focus:border-transparent disabled:bg-${baseColor}-100 text-gray-900 transition-all duration-300`}
      />
    </div>
  );
};

// ✅ small reusable empty tab component
const EmptyTab = ({ icon: Icon, color, title, subtitle }) => (
  <div className="text-center py-16 bg-blue-50 rounded-2xl border border-blue-200">
    <Icon size={64} className={`mx-auto ${color} mb-4`} />
    <p className="text-lg text-gray-600 mb-2">{title}</p>
    <p className="text-gray-500">{subtitle}</p>
  </div>
);
