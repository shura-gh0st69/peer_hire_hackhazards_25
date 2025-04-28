import React from 'react';
import { CustomButton } from '@/components/ui/custom-button';
import { BaseIcon, GrokIcon, ScreenpipeIcon } from '@/components/icons';
import { Link } from 'react-router-dom';
import { Shield, Briefcase, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      {/* Hero Section */}
      <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How PeerHire Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how our platform combines blockchain security, AI assistance, and work verification
            to create a seamless freelancing experience.
          </p>
        </div>

        {/* For Freelancers */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <Briefcase className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">For Freelancers</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Create Your Profile</h3>
              <p className="text-gray-600 mb-4">Connect your Coinbase Smart Wallet and build your professional profile with verified skills and experience.</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Wallet-based authentication</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Skill verification through AI</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Find & Win Projects</h3>
              <p className="text-gray-600 mb-4">Browse AI-matched projects and submit winning proposals with Grok's assistance.</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">AI job recommendations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Smart proposal writing</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Get Paid Securely</h3>
              <p className="text-gray-600 mb-4">Submit work with automated verification and receive instant payments through smart contracts.</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Screenpipe work verification</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Instant blockchain payments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* For Clients */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <Users className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">For Clients</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Post Your Project</h3>
              <p className="text-gray-600 mb-4">Create detailed job listings with AI assistance and set up secure milestone-based payments.</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">AI-assisted job posting</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Smart milestone planning</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Find Perfect Talent</h3>
              <p className="text-gray-600 mb-4">Review AI-verified profiles and get matched with the best freelancers for your project.</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">AI talent matching</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Verified skill assessments</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Manage & Pay</h3>
              <p className="text-gray-600 mb-4">Track progress with AI verification and release secure payments through smart contracts.</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Automated work verification</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Secure escrow payments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Powered By Leading Technologies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start">
              <BaseIcon className="w-8 h-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-2">Base Blockchain</h3>
                <p className="text-gray-600">Secure, low-cost transactions and smart contracts on Ethereum L2.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start">
              <GrokIcon className="w-8 h-8 text-accent mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-2">Groq AI</h3>
                <p className="text-gray-600">Advanced AI assistance for job matching and skill verification.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-start">
              <ScreenpipeIcon className="w-8 h-8 text-success mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium mb-2">Screenpipe</h3>
                <p className="text-gray-600">Automated work verification and progress tracking.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/auth/signup">
            <CustomButton size="lg" className="mr-4">
              Get Started
            </CustomButton>
          </Link>
          <Link to="/contact">
            <CustomButton variant="outline" size="lg">
              Contact Us
            </CustomButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
