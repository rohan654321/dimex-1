// components/CashfreePayment.tsx
'use client';

import { useState, useEffect } from 'react';

interface CashfreePaymentProps {
  invoiceId: string;
  amount: number;
  requirementsId: string;
  onSuccess?: (data: { orderId: string; paymentId?: string }) => void;
  onFailure?: (error: string) => void;
}

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function CashfreePayment({
  invoiceId,
  amount,
  requirementsId,
  onSuccess,
  onFailure
}: CashfreePaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'https://diemex-backend.onrender.com';

  // Load Cashfree SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => {
      console.log('Cashfree SDK loaded');
      setIsSDKLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Cashfree SDK');
      setError('Failed to load payment SDK');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!isSDKLoaded) {
      setError('Payment SDK not loaded yet. Please wait.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get exhibitor details from localStorage
      const exhibitorData = localStorage.getItem('exhibitor_data');
      let exhibitorDetails = {};
      
      if (exhibitorData) {
        try {
          exhibitorDetails = JSON.parse(exhibitorData);
        } catch (e) {
          console.error('Failed to parse exhibitor data', e);
        }
      }

      const token = localStorage.getItem('exhibitor_token') || localStorage.getItem('token');

      console.log('Creating Cashfree order...', {
        amount,
        invoiceId,
        requirementsId,
        exhibitorDetails
      });

      const response = await fetch(`${API_BASE_URL}/api/cashfree/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          invoiceId,
          requirementsId,
          customerDetails: exhibitorDetails
        })
      });

      const result = await response.json();
      console.log('Order response:', result);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create order');
      }

      const { paymentSessionId, orderId } = result.data;

      if (!paymentSessionId) {
        console.error('Missing paymentSessionId. Full response:', result.data);
        throw new Error('Payment session ID not received from server. Please contact support.');
      }

      console.log('Opening Cashfree checkout...', {
        paymentSessionId,
        orderId
      });

      // Initialize Cashfree with proper configuration
      const cashfree = new window.Cashfree({
        mode: 'production' // Change to 'sandbox' for testing
      });

      // Open checkout
      const paymentResult = await cashfree.checkout({
        paymentSessionId: paymentSessionId,
        redirectTarget: '_self' // or '_blank' for new tab
      });

      console.log('Payment result:', paymentResult);

      // Handle payment result
      if (paymentResult && paymentResult.error) {
        throw new Error(paymentResult.error);
      }

      // Check payment status
      if (paymentResult && paymentResult.paymentDetails) {
        const { paymentStatus, paymentId } = paymentResult.paymentDetails;
        
        if (paymentStatus === 'SUCCESS' || paymentStatus === 'success') {
          onSuccess?.({ orderId, paymentId });
        } else {
          throw new Error(`Payment ${paymentStatus || 'failed'}`);
        }
      } else if (paymentResult && paymentResult.orderId) {
        // Alternative response structure
        onSuccess?.({ orderId: paymentResult.orderId, paymentId: paymentResult.paymentId });
      } else {
        // Payment might be pending or redirecting
        console.log('Payment initiated, waiting for redirect...');
      }

    } catch (err: any) {
      console.error('Payment error:', err);
      const errorMessage = err.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      onFailure?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">
          <ExclamationCircleIcon className="h-12 w-12 mx-auto" />
          <p className="mt-2">{error}</p>
        </div>
        <button
          onClick={() => setError(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Complete Payment</h3>
        <p className="text-3xl font-bold text-blue-600 mt-2">₹{amount.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-1">Invoice: {invoiceId}</p>
      </div>

      <button
        onClick={handlePayment}
        disabled={isLoading || !isSDKLoaded}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
          isLoading || !isSDKLoaded
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            Processing...
          </div>
        ) : !isSDKLoaded ? (
          'Loading Payment Gateway...'
        ) : (
          `Pay ₹${amount.toLocaleString()}`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Secure payment powered by Cashfree
      </p>
    </div>
  );
}

// Missing icon import - add at top of file if needed
function ExclamationCircleIcon(props: any) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  );
}