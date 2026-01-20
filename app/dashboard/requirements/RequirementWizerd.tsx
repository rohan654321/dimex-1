// components/RequirementWizard.tsx
'use client';

import { SetStateAction, useState } from 'react';
import FurnitureRequirementForm from './steps/FurnitureRequirementForm';
import FurnitureSelectionStep from './steps/FurnitureSelectionStep';
import DesignCustomizationStep from './steps/DesignCustomizationStep';
import CostSummary from './steps/CostSummary';
import TermsConditions from './steps/TermsConditions';
import PaymentStep from './steps/PaymentStep';
import RequirementForm from './steps/RequirementForm';

export default function RequirementWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [category, setCategory] = useState<string>('');

  const [formData, setFormData] = useState({
    type: 'furniture',
    category: '',
    description: '',
    quantity: 1,
    estimatedCost: 0,
    acceptedTerms: false,
    furnitureItems: [] as any[],
    selectedDesigns: [] as any[],
    layoutType: '',
    decorationTheme: '',
    specialRequirements: ''
  });

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setFormData({ ...formData, category: selectedCategory });
    setStep(2);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Extra Requirement – Step {step} of 6
            </h2>
            <p className="text-sm text-gray-600">
              {step === 1 && 'Select Requirement Type'}
              {step === 2 && `Select ${category} Items`}
              {step === 3 && 'Design & Customization'}
              {step === 4 && 'Cost Summary'}
              {step === 5 && 'Terms & Conditions'}
              {step === 6 && 'Payment'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl p-2 hover:bg-gray-100 rounded-full transition"
          >
            ✕
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step >= stepNum 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {stepNum}
                </div>
                {stepNum < 6 && (
                  <div className={`
                    w-16 h-1 mx-2
                    ${step > stepNum ? 'bg-blue-600' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <RequirementForm
              onCategorySelect={handleCategorySelect}
              onNext={() => {
                if (formData.type === 'furniture') {
                  setStep(2);
                } else {
                  // Handle other types
                }
              }}
            />
          )}

          {step === 2 && category === 'furniture' && (
            <FurnitureRequirementForm
              data={formData}
              onNext={(data: SetStateAction<{ type: string; category: string; description: string; quantity: number; estimatedCost: number; acceptedTerms: boolean; furnitureItems: any[]; selectedDesigns: any[]; layoutType: string; decorationTheme: string; specialRequirements: string; }>) => {
                setFormData({ ...formData, ...data });
                setStep(3);
              }}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <FurnitureSelectionStep
              data={formData}
              onNext={(selectedItems: any) => {
                setFormData({ ...formData, furnitureItems: selectedItems });
                setStep(4);
              }}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <DesignCustomizationStep
              data={formData}
              onNext={(designData: any) => {
                const updatedData = { ...formData, ...designData };
                // Calculate cost
                const totalCost = calculateTotalCost(updatedData);
                updatedData.estimatedCost = totalCost;
                setFormData(updatedData);
                setStep(5);
              }}
              onBack={() => setStep(3)}
            />
          )}

          {step === 5 && (
            <CostSummary
              data={formData}
              onBack={() => setStep(4)}
              onNext={() => setStep(6)}
            />
          )}

          {step === 6 && (
            <TermsConditions
              accepted={formData.acceptedTerms}
              onAccept={() => {
                setFormData({ ...formData, acceptedTerms: true });
                // Proceed to payment
              }}
              onBack={() => setStep(5)}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={() => setStep(prev => Math.max(1, prev - 1) as any)}
              className={`px-6 py-2 rounded-lg border ${step === 1 ? 'invisible' : 'hover:bg-gray-50'}`}
              disabled={step === 1}
            >
              Back
            </button>
            <div className="text-right">
              {step < 6 && (
                <button
                  onClick={() => {
                    // Handle step-specific validation
                    setStep(prev => Math.min(6, prev + 1) as any);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {step === 5 ? 'Proceed to Payment' : 'Continue'}
                </button>
              )}
              {step === 6 && (
                <PaymentStep
                  amount={formData.estimatedCost}
                  onBack={() => setStep(5)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateTotalCost(data: any): number {
  // Implement cost calculation logic
  return data.furnitureItems.reduce((sum: number, item: any) => 
    sum + (item.price * item.quantity), 0);
}