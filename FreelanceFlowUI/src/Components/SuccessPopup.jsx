import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

const SuccessPopup = ({ message, show, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className="bg-green-100 border border-green-400 text-green-800 px-5 py-3 rounded-xl shadow-md flex items-center space-x-3 animate-slide-in">
        <FaCheckCircle className="text-green-600 text-lg" />
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-green-600 hover:text-green-800 font-bold text-lg"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
