import { useState } from 'react';
import toast from 'react-hot-toast';

interface UseFormSubmissionProps {
  formType: string;
  onSuccess?: () => void;
}

export default function useFormSubmission({ formType, onSuccess }: UseFormSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const submitForm = async (data: Record<string, any>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          formType,
          submittedAt: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Submitted successfully!');
        setShowThankYou(true);
        onSuccess?.();
        return true;
      } else {
        toast.error('Submission failed. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    showThankYou,
    setShowThankYou,
    submitForm,
  };
}