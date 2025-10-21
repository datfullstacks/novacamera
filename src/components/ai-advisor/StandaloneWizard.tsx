'use client';

import { useState } from 'react';
import WizardSteps from './WizardSteps';
import LoadingScreen from './LoadingScreen';

interface StandaloneWizardProps {
  onComplete: (data: Record<string, unknown>) => void;
}

export default function StandaloneWizard({ onComplete }: StandaloneWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleStepComplete = (data: Record<string, unknown>) => {
    const updatedData = { ...wizardData, ...data };
    setWizardData(updatedData);

    if (currentStep < 4) {
      // Move to next step
      setCurrentStep(currentStep + 1);
    } else {
      // Step 4 complete - show loading and call API
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        onComplete(updatedData);
      }, 3000);
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / 4) * 100;
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">
            Bước {currentStep} / 4
          </span>
          <span className="text-gray-600">{getProgressPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Wizard Steps */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <WizardSteps
          currentStep={currentStep}
          onStepComplete={handleStepComplete}
        />
      </div>
    </div>
  );
}
