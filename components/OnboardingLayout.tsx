'use client';

import { Check } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
}

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Create Account',
    description: 'Register your store account',
  },
  {
    id: 2,
    title: 'Connect Store',
    description: 'Link your e-commerce platform',
  },
  {
    id: 3,
    title: 'Choose Plan',
    description: 'Select your subscription',
  },
];

export default function OnboardingLayout({ children, currentStep }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-80 xl:w-96 bg-neutral-900 text-white flex-col">
        <div className="p-8 lg:p-10">
          {/* Logo */}
          <div className="mb-16">
            <h1 className="text-3xl font-serif font-medium tracking-tight">Livero</h1>
            <p className="text-neutral-400 text-sm mt-2 font-light">Store Onboarding</p>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isUpcoming = currentStep < step.id;

              return (
                <div key={step.id} className="flex items-start gap-4">
                  {/* Step Indicator */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-12 h-12 bg-white text-neutral-900 flex items-center justify-center">
                        <Check className="w-6 h-6 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div
                        className={`w-12 h-12 border-2 flex items-center justify-center font-medium ${
                          isCurrent
                            ? 'border-white bg-white text-neutral-900'
                            : 'border-neutral-700 text-neutral-500'
                        }`}
                      >
                        {step.id}
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pt-2">
                    <h3
                      className={`text-sm uppercase tracking-widest font-medium mb-1 ${
                        isCurrent ? 'text-white' : isCompleted ? 'text-neutral-300' : 'text-neutral-600'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm font-light ${
                        isCurrent ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-16 pt-8 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-neutral-400">Progress</span>
              <span className="text-sm font-medium text-white">
                {Math.round(((currentStep - 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-800">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${((currentStep - 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-auto p-8 lg:p-10 bg-neutral-950 border-t border-neutral-800">
          <h4 className="text-xs uppercase tracking-widest text-neutral-400 mb-3">Need Help?</h4>
          <p className="text-sm text-neutral-300 font-light mb-4">
            Our support team is here to assist you with the onboarding process.
          </p>
          <a
            href="/contact"
            className="inline-block text-sm text-white hover:text-neutral-300 transition-colors border-b border-white"
          >
            Contact Support
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Progress */}
        <div className="lg:hidden border-b border-neutral-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-neutral-600">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-neutral-900">
              {Math.round(((currentStep - 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-200">
            <div
              className="h-full bg-neutral-900 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

