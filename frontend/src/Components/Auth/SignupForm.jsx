import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUp, clearError } from '../../store/slices/auth/authSlice';

export default function SignupForm({ onSwitchToLogin, onSwitchToOTP }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(
      signUp({
        fullName: formData.fullName,
        gender: formData.gender,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    );

    if (!result.error) {
      onSwitchToOTP();
    }
  };

  return (
    <>
      <h3 className="text-xl sm:text-2xl font-bold text-center mb-6">Sign Up</h3>

      {(error || validationError) && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {validationError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
          <option value="O">Other</option>
          <option value="N">Prefer not to say</option>
        </select>

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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Creating Account...' : 'Continue'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-red-500 hover:underline font-semibold"
        >
          Login
        </button>
      </p>
    </>
  );
}
