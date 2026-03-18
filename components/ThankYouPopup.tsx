import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ThankYouPopupProps {
  isVisible: boolean;
  onClose: () => void;
  name?: string;
}

export default function ThankYouPopup({
  isVisible,
  onClose,
  name = "there",
}: ThankYouPopupProps) {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (!isVisible) return;

    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          onClose();          // close popup
          router.push("/");   // ✅ redirect to home

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onClose, router]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* CARD */}
      <div className="relative w-[320px] rounded-xl bg-white p-8 text-center shadow-2xl border">

        {/* TOP ICON */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500 shadow-lg">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Thank You!
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Your details have been successfully submitted.
          </p>

          {/* TIMER */}
          <p className="mt-3 text-sm text-gray-500">
            Redirecting in{" "}
            <span className="font-bold text-green-600">{countdown}s</span>
          </p>

          {/* BUTTON */}
          <button
            onClick={() => {
              onClose();
              router.push("/");
            }}
            className="mt-6 w-full rounded-md bg-green-500 py-2 text-white font-medium hover:bg-green-600 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}