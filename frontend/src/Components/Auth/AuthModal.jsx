import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import OTPForm from './OTPForm';
import SetPasswordForm from './SetPasswordForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';

export default function AuthModal({ isOpen, onClose, mode = 'login' }) {
  const [currentPage, setCurrentPage] = useState(mode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
      <div className="relative bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl w-[90%] max-w-md border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-center text-black mb-6">
          SPORTSWEAR<span className="text-red-500">9</span>
        </h2>

        {currentPage === 'login' && (
          <LoginForm
            onSwitchToSignup={() => setCurrentPage('signup')}
            onSwitchToForgot={() => setCurrentPage('forgot')}
            onClose={onClose}
          />
        )}

        {currentPage === 'signup' && (
          <SignupForm
            onSwitchToLogin={() => setCurrentPage('login')}
            onSwitchToOTP={() => setCurrentPage('otp')}
          />
        )}

        {currentPage === 'otp' && (
          <OTPForm
            onClose={onClose}
            onSwitchToSetPassword={() => setCurrentPage('setPassword')}
          />
        )}

        {currentPage === 'setPassword' && (
          <SetPasswordForm onClose={onClose} />
        )}

        {currentPage === 'forgot' && (
          <ForgotPasswordForm
            onSwitchToReset={() => setCurrentPage('reset')}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        )}

        {currentPage === 'reset' && (
          <ResetPasswordForm onClose={onClose} />
        )}
      </div>
    </div>
  );
}
