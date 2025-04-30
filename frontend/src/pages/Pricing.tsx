import React from 'react';
import { CustomButton } from '@/components/ui/custom-button';
import { Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className=" pt-28 text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your needs. All plans include access to our core features.
          </p>
        </div>

        {/* Platform Fee Notice */}
        <div className="max-w-3xl mx-auto mb-12 bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-start">
          <Info className="w-5 h-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-900 mb-1">Platform Fee</h3>
            <p className="text-gray-600 text-sm">
              A 2.5% platform fee applies to all transactions to support platform maintenance and development.
              This fee is automatically handled by our smart contracts.
            </p>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Basic Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic</h2>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">$9</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <p className="text-gray-600 mt-4">Perfect for freelancers just getting started.</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Up to 10 active proposals</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Basic AI job matching</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Standard work verification</span>
                </li>
              </ul>
              <Link to="/auth/signup" className="block mt-6">
                <CustomButton fullWidth>Get Started</CustomButton>
              </Link>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-primary overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl">
              Popular
            </div>
            <div className="p-6 border-b border-gray-200 bg-primary/5">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pro</h2>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <p className="text-gray-600 mt-4">For established freelancers and small businesses.</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Unlimited active proposals</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Advanced AI job matching</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Priority work verification</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Groq AI proposal assistance</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Featured profile listing</span>
                </li>
              </ul>
              <Link to="/auth/signup" className="block mt-6">
                <CustomButton fullWidth variant="primary">
                  Get Started
                </CustomButton>
              </Link>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h2>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">$99</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <p className="text-gray-600 mt-4">For large teams and organizations.</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">All Pro features included</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Team collaboration tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Custom workflow automation</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Custom API integrations</span>
                </li>
              </ul>
              <Link to="/enterprise" className="block mt-6">
                <CustomButton fullWidth variant="outline">
                  Contact Sales
                </CustomButton>
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept payments through Coinbase Smart Wallet in USDC and other supported stablecoins on the Base network.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">How does the platform fee work?</h3>
              <p className="text-gray-600">
                A 2.5% platform fee is automatically deducted from each transaction through our smart contracts.
                This fee helps maintain and improve the platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">
                Yes, you can change your plan at any time. Changes will take effect at the start of your next billing cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
