import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message) => {
    addToast({ type: 'success', message });
  }, [addToast]);

  const showError = useCallback((message) => {
    addToast({ type: 'error', message });
  }, [addToast]);

  const showWarning = useCallback((message) => {
    addToast({ type: 'warning', message });
  }, [addToast]);

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showWarning,
  };
};