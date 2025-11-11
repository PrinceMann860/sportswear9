import React, { useState, useEffect } from "react";
import { User, MapPin, Package, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/auth/authSlice";
import {
  fetchProfile,
  updateProfile,
  fetchAddresses,
  deleteAddress,
  addAddress,
  updateAddress,
} from "./Profileslice";

const ProfilePage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const dispatch = useDispatch();

  const profileData = useSelector((state) => state.profile.data);
  const profileLoading = useSelector((state) => state.profile.loading);
  const addresses = useSelector((state) => state.profile.addresses);

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "M",
    phone: "",
    country: "",
  });

  const [addressForm, setAddressForm] = useState({
    address_name: "",
    first_name: "",
    last_name: "",
    mobile: "",
    pincode: "",
    country: "India",
    address_line_1: "",
    locality_area_street: "",
    locality: "",
    city: "",
    state: "",
    landmark: "",
    is_default: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
      dispatch(fetchAddresses());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!profileData) return;
    const { full_name, email, gender, phoneNumber, country } = profileData;
    setFormData({
      name: full_name || user?.full_name || "",
      email: email || user?.email || "",
      gender: gender || "M",
      phone: phoneNumber || "",
      country: country || "India",
    });
  }, [profileData, user]);

  const handleLogout = () => dispatch(logout());

  const handleSaveProfile = async () => {
    await dispatch(
      updateProfile({
        full_name: formData.name,
        gender: formData.gender,
        phoneNumber: formData.phone,
        country: formData.country,
      })
    );
    setIsEditing(false);
    dispatch(fetchProfile());
  };

  // ✅ Add / Edit / Delete Address
  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      address_name: "",
      first_name: "",
      last_name: "",
      mobile: "",
      pincode: "",
      country: "India",
      address_line_1: "",
      locality_area_street: "",
      locality: "",
      city: "",
      state: "",
      landmark: "",
      is_default: false,
    });
    setShowAddressModal(true);
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEditAddress = (addr) => {
  setEditingAddress(addr);
  setAddressForm({
    address_name: addr.address_name || "",
    first_name: addr.first_name || "",
    last_name: addr.last_name || "",
    mobile: addr.mobile || "",
    pincode: addr.pincode || "",
    country: addr.country || "India",
    address_line_1: addr.address_line_1 || "",
    locality_area_street: addr.locality_area_street || "",
    locality: addr.locality || "",
    city: addr.city || "",
    state: addr.state || "",
    landmark: addr.landmark || "",
    is_default: addr.is_default || false,
  });
  setShowAddressModal(true);
};


  const handleSaveAddress = async () => {
    if (editingAddress) {
      await dispatch(
        updateAddress({
          addressId: editingAddress.address_id,
          updatedData: addressForm,
        })
      );
    } else {
      await dispatch(addAddress(addressForm));
    }
    await dispatch(fetchAddresses());
    setShowAddressModal(false);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      await dispatch(deleteAddress(id));
      await dispatch(fetchAddresses());
    }
  };

  const menuItems = [
    { id: "profile", label: "Profile Info", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
  ];

  if (loading || profileLoading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-blue-100">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg">
              <User size={32} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {formData.name || "User"}
              </h3>
              <p className="text-sm text-gray-500">{formData.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                  activeTab === item.id
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <item.icon className="w-5 h-5" /> {item.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
          {/* Profile Info Tab */}
          {activeTab === "profile" && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Profile Information</h2>
                <button
                  onClick={() =>
                    isEditing ? handleSaveProfile() : setIsEditing(true)
                  }
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
                >
                  {isEditing ? "Save" : "Edit"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                />
                <InputField label="Email" value={formData.email} disabled />
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <InputField
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                />
                <InputField
                  label="Country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>
            </>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Addresses</h2>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={openAddAddress}
                >
                  + Add Address
                </button>
              </div>
              {Array.isArray(addresses) && addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div
                      key={addr.address_id}
                      className="p-5 border border-blue-200 rounded-xl bg-blue-50 shadow-sm relative"
                    >
                      <h3 className="font-semibold text-lg mb-1">
                        {addr.address_name}
                      </h3>
                      <p className="text-gray-700">
                        {addr.first_name} {addr.last_name}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {addr.address_line_1}, {addr.city}, {addr.state}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {addr.country} - {addr.pincode}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        📞 {addr.mobile}
                      </p>
                      <div className="absolute top-3 right-3 flex gap-3">
                        <button
                          onClick={() => handleEditAddress(addr)}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.address_id)}
                          className="text-red-600 text-sm hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No saved addresses yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
            <h3 className="text-xl font-semibold mb-4">
              {editingAddress ? "Edit Address" : "Add Address"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* ✅ Address Type Dropdown */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Address Type
                </label>
                <select
                  name="address_name"
                  value={addressForm.address_name}
                  onChange={handleAddressChange}
                  className="border rounded-lg p-2 text-sm w-full"
                >
                  <option value="">Select Type</option>
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* ✅ Rest of address fields */}
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={addressForm.first_name}
                onChange={handleAddressChange}
                className="border rounded-lg p-2 text-sm w-full"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={addressForm.last_name}
                onChange={handleAddressChange}
                className="border rounded-lg p-2 text-sm w-full"
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
                value={addressForm.mobile}
                onChange={handleAddressChange}
                className="border rounded-lg p-2 text-sm w-full"
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={addressForm.pincode}
                onChange={handleAddressChange}
                className="border rounded-lg p-2 text-sm w-full"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={addressForm.country}
                onChange={handleAddressChange}
                className="border rounded-lg p-2 text-sm w-full"
              />
              <input
                type="text"
                name="address_line_1"
                placeholder="Address Line 1"
                value={addressForm.address_line_1}
                onChange={handleAddressChange}
                className="border rounded-lg p-2 text-sm w-full"
              />
              <input
                type="text"
                name="locality_area_street"
                placeholder="Area / Street"
                value={addressForm.locality_area_street}
                onChange={handleAddressChange}
                className="border rounded-lg p-2 text-sm w-full"
              />
              <input
                type="text"
                name="locality"
                placeholder="Locality"
                value={addressForm.locality}
                onChange={handleAddressChange}
                className="border rounded-lg p-2 text-sm w-full"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={addressForm.city}
                onChange={handleAddressChange}
                className="border rounded-lg p-2 text-sm w-full"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={addressForm.state}
                onChange={handleAddressChange}
                className="border rounded-lg p-2 text-sm w-full"
              />
              <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={addressForm.landmark}
                onChange={handleAddressChange}
                className="border rounded-lg p-2 text-sm w-full"
              />

              <label className="flex items-center gap-2 col-span-2">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={addressForm.is_default}
                  onChange={handleAddressChange}
                />
                Set as default
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingAddress ? "Save Changes" : "Add Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full border rounded-lg p-2"
    />
  </div>
);

export default ProfilePage;
