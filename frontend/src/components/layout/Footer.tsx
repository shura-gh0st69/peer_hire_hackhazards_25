
import React from 'react';
import { Link } from 'react-router-dom';
import { BaseIcon, GroqIcon, ScreenpipeIcon } from '../icons';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-poppins font-bold mb-4">PeerHire</h3>
            <p className="text-gray-300 mb-4">
              The decentralized freelance platform powered by AI and blockchain technology.
            </p>
            <div className="flex space-x-4">
              <BaseIcon className="w-6 h-6 text-white opacity-80 hover:opacity-100 cursor-pointer" />
              <GroqIcon className="w-6 h-6 text-white opacity-80 hover:opacity-100 cursor-pointer" />
              <ScreenpipeIcon className="w-6 h-6 text-white opacity-80 hover:opacity-100 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">For Freelancers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/find-work" className="text-gray-300 hover:text-white">Find Work</Link>
              </li>
              <li>
                <Link to="/create-profile" className="text-gray-300 hover:text-white">Create Profile</Link>
              </li>
              <li>
                <Link to="/freelancer-resources" className="text-gray-300 hover:text-white">Resources</Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-gray-300 hover:text-white">Success Stories</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">For Clients</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/post-job" className="text-gray-300 hover:text-white">Post a Job</Link>
              </li>
              <li>
                <Link to="/find-talent" className="text-gray-300 hover:text-white">Find Talent</Link>
              </li>
              <li>
                <Link to="/enterprise" className="text-gray-300 hover:text-white">Enterprise Solutions</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-white">Pricing</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help-center" className="text-gray-300 hover:text-white">Help Center</Link>
              </li>
              <li>
                <Link to="/about-us" className="text-gray-300 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} PeerHire. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
            <Link to="/security" className="text-gray-400 hover:text-white text-sm">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
