import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Phone, MapPin, Calendar, Shield, Trash2, User } from 'lucide-react';
import { userService } from '../../services/userService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useToast } from '../../hooks/useToast';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddresses();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const userData = await userService.getUser(id);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      showError('Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAddresses = async () => {
    try {
      setAddressesLoading(true);
      const addressData = await userService.getUserAddresses(id);
      setAddresses(addressData?.addresses || addressData || []);
    } catch (error) {
      console.error('Failed to fetch user addresses:', error);
      // Don't show error for addresses as it's not critical
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm(`Are you sure you want to delete user "${user.email}"? This action cannot be undone.`)) {
      try {
        await userService.deleteUser(id);
        showSuccess('User deleted successfully');
        navigate('/users');
      } catch (error) {
        console.error('Failed to delete user:', error);
        showError('Failed to delete user');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">User not found</div>
        <button
          onClick={() => navigate('/users')}
          className="btn-secondary"
        >
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/users')}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.email}
            </h1>
            <p className="text-gray-600">User ID: {user.user_uuid}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleDeleteUser}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              {user.profile?.profile_picture ? (
                <img
                  src={user.profile.profile_picture}
                  alt={user.email}
                  className="w-24 h-24 rounded-full mx-auto object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-600" />
                </div>
              )}
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{user.email}</h3>
              <div className="mt-2 flex justify-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
                {user.is_staff && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Staff
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <p className="text-gray-900 font-mono">{user.user_uuid}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Joined</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{formatDate(user.date_joined)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-gray-900">{user.is_staff ? 'Staff User' : 'Regular User'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          {user.profile && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.profile.phoneNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{user.profile.phoneNumber}</p>
                    </div>
                  </div>
                )}
                
                {user.profile.gender && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <p className="text-gray-900">
                      {user.profile.gender === 'M' ? 'Male' : user.profile.gender === 'F' ? 'Female' : 'Other'}
                    </p>
                  </div>
                )}

                {user.profile.country && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <p className="text-gray-900">{user.profile.country}</p>
                  </div>
                )}

                {user.profile.locale && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Locale</label>
                    <p className="text-gray-900">{user.profile.locale}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Addresses */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Addresses</h3>
            {addressesLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No addresses found
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.address_id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{address.address_name}</span>
                          {address.is_default && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <p>{address.first_name} {address.last_name}</p>
                          <p>{address.address_line_1}</p>
                          <p>{address.locality_area_street}, {address.locality}</p>
                          <p>{address.city}, {address.state} {address.pincode}</p>
                          <p>{address.country}</p>
                          {address.landmark && <p>Landmark: {address.landmark}</p>}
                          <p className="mt-1">Phone: {address.mobile}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Added: {formatDate(address.created_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;