import React from 'react';
import { CustomButton } from '@/components/ui/custom-button';
import { BaseIcon, GrokIcon, ScreenpipeIcon } from '@/components/icons';
import { Link } from 'react-router-dom';
import { Users, Shield, Code, Globe, Heart, Target } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'Jaykumar Patel',
      role: 'Fullstack Dev | The Blockchain Guy | Groq Guy',
      image: 'https://cdn3d.iconscout.com/3d/premium/thumb/profile-3d-icon-download-in-png-blend-fbx-gltf-file-formats--user-avatar-account-interface-pack-icons-5220669.png?f=webp'
    },
    {
      name: 'V Meghashreee',
      role: 'Frontend Lead | Screenpipe Integration',
      image: 'https://cdn3d.iconscout.com/3d/premium/thumb/profile-3d-icon-download-in-png-blend-fbx-gltf-file-formats--user-avatar-account-interface-pack-icons-5220669.png?f=webp'
    },
    {
      name: 'Tejaswini S',
      role: 'Backend Dev',
      image: 'https://cdn3d.iconscout.com/3d/premium/thumb/profile-3d-icon-download-in-png-blend-fbx-gltf-file-formats--user-avatar-account-interface-pack-icons-5220669.png?f=webp'
    },
    {
      name: 'Priyanshi Bhardwaj',
      role: 'AI Specialist',
      image: 'https://cdn3d.iconscout.com/3d/premium/thumb/profile-3d-icon-download-in-png-blend-fbx-gltf-file-formats--user-avatar-account-interface-pack-icons-5220669.png?f=webp'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="pt-28 text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About PeerHire</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting freelancers and clients securely through blockchain and AI,
            transforming the future of work.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Target className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              PeerHire aims to revolutionize the freelance marketplace by combining
              blockchain security with AI-powered verification. We're building a
              platform where trust is built into every transaction, and opportunities
              are accessible to talent worldwide.
            </p>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Secure Transactions</h3>
            <p className="text-gray-600">
              Smart contracts on Base ensure secure, transparent payments with escrow
              protection for both parties.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Code className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI-Powered Matching</h3>
            <p className="text-gray-600">
              Grok AI helps match the perfect talent to projects and verifies work
              quality automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <Globe className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Global Reach</h3>
            <p className="text-gray-600">
              Connect with talent and opportunities worldwide, with automated
              verification and trust built-in.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're a diverse team of developers, designers, and blockchain experts
              passionate about creating the future of work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Partners */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Technology Partners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're proud to work with leading technology providers to deliver the best
              possible experience for our users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
              <BaseIcon className="w-12 h-12 text-primary mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Base</h3>
                <p className="text-sm text-gray-600">Secure blockchain infrastructure</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
              <GrokIcon className="w-12 h-12 text-accent mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Groq</h3>
                <p className="text-sm text-gray-600">Advanced AI capabilities</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
              <ScreenpipeIcon className="w-12 h-12 text-success mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Screenpipe</h3>
                <p className="text-sm text-gray-600">Work verification technology</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join PeerHire today and experience the future of freelancing with
            blockchain security and AI assistance.
          </p>
          <Link to="/auth/signup">
            <CustomButton size="lg" className="mr-4">
              Sign Up Now
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

export default About;
