import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, googleLogin, clearError } from '../../store/slices/auth/authSlice';
import { FaGoogle } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginForm({ onSwitchToSignup, onSwitchToForgot, onClose }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (!result.error) {
      onClose();
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await dispatch(googleLogin({ accessToken: credentialResponse.credential }));
    if (!result.error) {
      onClose();
    }
  };

  const handleGoogleError = () => {
    dispatch(clearError());
  };

  return (
    <>
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-6">Login</h3>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />

        <button
          type="button"
          onClick={onSwitchToForgot}
          className="text-sm text-red-500 hover:underline text-right"
        >
          Forgot Password?
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          size="large"
          text="continue_with"
          width="100%"
        />
      </div>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToSignup}
          className="text-red-500 hover:underline font-semibold"
        >
          Sign Up
        </button>
      </p>
    </>
  );
}
