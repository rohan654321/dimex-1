import React, { useEffect, useState } from 'react';

interface ThankYouPopupProps {
  isVisible: boolean;
  onClose: () => void;
  name?: string;
  formType?: string;
}

export default function ThankYouPopup({ 
  isVisible, 
  onClose, 
  name = 'there',
  formType = 'contact'
}: ThankYouPopupProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isVisible) {
      setCountdown(5);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleRedirect();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  const handleRedirect = () => {
    onClose();
    window.location.href = '/';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <svg 
              className="h-16 w-16 text-green-600" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-center text-3xl font-bold text-gray-900">
          Thank You, {name}!
        </h2>

        {/* Message */}
        <p className="mb-6 text-center text-gray-600">
          Your form has been submitted successfully. We've sent a confirmation email to your inbox.
        </p>

        {/* Countdown */}
        <div className="mb-8 rounded-xl bg-blue-50 p-4 text-center">
          <div className="inline-flex items-center gap-2 text-blue-700">
            <span className="h-2 w-2 animate-ping rounded-full bg-blue-500"></span>
            <span className="font-medium">Redirecting in</span>
            <span className="font-mono text-2xl font-bold text-blue-600">{countdown}</span>
            <span className="font-medium">seconds</span>
          </div>
          <p className="mt-2 text-sm text-blue-600">
            You will be automatically redirected to homepage
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            Stay Here
          </button>
          <button
            onClick={handleRedirect}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
          >
            Go to Homepage Now
          </button>
        </div>
      </div>
    </div>
  );
}