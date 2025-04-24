import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Briefcase, Calendar, Zap } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { BaseIcon, GrokIcon, ScreenpipeIcon } from '@/components/icons';

const Home = () => {
  return (
    <div className="font-poppins">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6 leading-tight">
                The Next-Gen <span className="text-primary">Freelance</span> Platform Powered by AI & Blockchain
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Connect with clients, secure payments via Base, and enhance your work with Grok AI & Screenpipe integration.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/auth/signup">
                  <CustomButton
                    size="lg"
                    leftIcon={<BaseIcon className="w-5 h-5" />}
                  >
                    Get Started
                  </CustomButton>
                </Link>
                <Link to="/how-it-works">
                  <CustomButton
                    variant="outline"
                    size="lg"
                  >
                    Learn More
                  </CustomButton>
                </Link>
              </div>
              <div className="mt-10 flex items-center space-x-8">
                <div className="flex items-center">
                  <BaseIcon className="w-5 h-5 text-primary mr-2" />
                  <span className="text-sm text-gray-600">Base Integration</span>
                </div>
                <div className="flex items-center">
                  <GrokIcon className="w-5 h-5 text-accent mr-2" />
                  <span className="text-sm text-gray-600">Grok AI Powered</span>
                </div>
                <div className="flex items-center">
                  <ScreenpipeIcon className="w-5 h-5 text-success mr-2" />
                  <span className="text-sm text-gray-600">Screenpipe Verified</span>
                </div>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 rounded-lg blur-xl"></div>
              <div className="relative bg-white rounded-lg shadow-xl p-6 border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 bg-gray-50 rounded p-4">
                    <h3 className="font-medium text-secondary mb-2">Mobile App Development</h3>
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Budget: $5,000</span>
                      <span>1 week ago</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Looking for React Native developer to build a social media app with user profiles, live chat...</p>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">React Native</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Firebase</span>
                      </div>
                      <div className="text-xs text-primary">12 bids</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                      <GrokIcon className="w-6 h-6 text-accent" />
                    </div>
                    <h4 className="font-medium text-sm">AI Contract Writing</h4>
                    <p className="text-xs text-gray-600 mt-1">Let Grok draft secure contracts for you</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-4">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-3">
                      <ScreenpipeIcon className="w-6 h-6 text-success" />
                    </div>
                    <h4 className="font-medium text-sm">Progress Tracking</h4>
                    <p className="text-xs text-gray-600 mt-1">Verify work with Screenpipe integration</p>
                  </div>
                  
                  <div className="col-span-2 bg-primary/5 rounded p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16">
                      <div className="absolute transform rotate-45 bg-primary text-white text-xs font-semibold py-1 right-[-40px] top-[20px] w-[150px] text-center">
                        Verified
                      </div>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-2">JD</div>
                      <div>
                        <p className="text-sm font-medium">John Doe</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <BaseIcon className="w-3 h-3 mr-1" />
                          <span>Base verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex space-x-2">
                        <span className="flex items-center">
                          <Briefcase className="w-3 h-3 mr-1" />
                          24 jobs
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          2 years
                        </span>
                      </div>
                      <span className="text-primary font-medium">$65/hr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">How PeerHire Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines the security of blockchain with the intelligence of AI to create a seamless freelancing experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BaseIcon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
              <p className="text-gray-600 mb-4">
                Connect your Coinbase Smart Wallet for secure, instant payments on the Base network with minimal fees.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Smart contract escrow protection</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Instant releases upon work verification</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">No middleman fees or delays</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <GrokIcon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Grok AI Assistant</h3>
              <p className="text-gray-600 mb-4">
                Leverage Grok's multimodal AI capabilities to enhance your freelancing experience at every step.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">AI-powered contract writing</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Project quality verification</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Job recommendation engine</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <ScreenpipeIcon className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-xl font-bold mb-3">Work Verification</h3>
              <p className="text-gray-600 mb-4">
                Use Screenpipe to transparently capture and verify work progress for both freelancers and clients.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Automated screenshot capturing</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">AI analysis of work progress</span>
                </li>
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Dispute prevention and resolution</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Freelancers & Clients */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-4 text-secondary flex items-center">
                <Briefcase className="w-6 h-6 mr-2 text-primary" />
                For Freelancers
              </h3>
              <p className="text-gray-600 mb-6">
                Showcase your skills, find quality clients, and get paid securely while letting our AI tools enhance your workflow.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="ml-3 text-gray-600">Create a verified blockchain profile</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="ml-3 text-gray-600">Receive personalized job recommendations</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="ml-3 text-gray-600">Get paid instantly and securely</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="ml-3 text-gray-600">Use AI to enhance your proposals and deliverables</p>
                </li>
              </ul>
              <Link to="/auth/freelancer-signup">
                <CustomButton size="lg">
                  Join as a Freelancer
                </CustomButton>
              </Link>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-4 text-secondary flex items-center">
                <Users className="w-6 h-6 mr-2 text-primary" />
                For Clients
              </h3>
              <p className="text-gray-600 mb-6">
                Find skilled professionals, verify their work with advanced AI tools, and pay securely through the blockchain.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="ml-3 text-gray-600">Post jobs and find skilled talent quickly</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="ml-3 text-gray-600">Secure escrow payment protection</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="ml-3 text-gray-600">AI-assisted talent matching and verification</p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="ml-3 text-gray-600">Real-time progress tracking with Screenpipe</p>
                </li>
              </ul>
              <Link to="/auth/client-signup">
                <CustomButton size="lg">
                  Hire Talent
                </CustomButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Featured Opportunities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover top projects from verified clients looking for skilled professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-secondary">
                      {["Frontend Developer", "UI/UX Designer", "Blockchain Developer"][i-1]}
                    </h3>
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      ${["50", "65", "85"][i-1]}/hr
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {[
                      "We need a React developer to build a responsive dashboard with data visualization components and user authentication.",
                      "Looking for a designer to create a modern, clean interface for our finance app with focus on usability and accessibility.",
                      "Seeking an experienced blockchain developer to implement smart contracts for our decentralized marketplace platform."
                    ][i-1]}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      ["React", "TypeScript", "Tailwind"],
                      ["Figma", "UI/UX", "Mobile"],
                      ["Solidity", "Base", "Web3"]
                    ][i-1].map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs mr-2">
                        {["AB", "CD", "EF"][i-1]}
                      </div>
                      <span>Verified Client</span>
                    </div>
                    <span>{["2 days", "1 week", "5 days"][i-1]} ago</span>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                  <Link to={`/jobs/${i}`} className="text-primary hover:text-primary/80 text-sm font-medium">
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Link to="/jobs">
              <CustomButton variant="outline" size="lg">
                View All Jobs
              </CustomButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from freelancers and clients who've found success on our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl mr-4">
                    {["JD", "AK", "MS"][i-1]}
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary">
                      {["John Doe", "Alice Kim", "Michael Smith"][i-1]}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {["Frontend Developer", "UI/UX Designer", "Blockchain Developer"][i-1]}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  {[
                    "PeerHire's integration with Base for payments has been a game-changer. I get paid instantly when my work is approved, with minimal fees.",
                    "The Grok AI assistant helped me write better proposals and even improved my design descriptions. My client hire rate has increased by 40%!",
                    "As someone who values transparency, the Screenpipe integration gives my clients confidence in my work. The verification process is seamless."
                  ][i-1]}
                </p>
                <div className="flex text-accent">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Freelancing Experience?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join PeerHire today and experience the future of freelancing with blockchain security and AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/auth/signup">
              <CustomButton
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Get Started
              </CustomButton>
            </Link>
            <Link to="/contact">
              <CustomButton
                variant="outline"
                size="lg"
                className="border-white text-white hover:text-white hover:bg-white/10"
              >
                Contact Us
              </CustomButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// This is for the Check icon since it wasn't imported at the top
const Check = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Star = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default Home;
