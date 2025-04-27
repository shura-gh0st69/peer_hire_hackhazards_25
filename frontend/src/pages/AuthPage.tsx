import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CustomButton } from '@/components/ui/custom-button';
import { BaseIcon, GrokIcon } from '@/components/icons';
import { Eye, EyeOff, ChevronLeft, Briefcase, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type AuthType = 'freelancer-signup' | 'client-signup' | 'login' | 'signup';

interface AuthPageProps {
  type: AuthType;
}

interface FormData {
  email: string;
  password: string;
  fullName: string;
  company?: string;
  headline?: string;
  hourlyRate?: string;
  skills?: string;
  bio?: string;
  industry?: string;
  companySize?: string;
  companyLocation?: string;
  location?: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ type = 'signup' }) => {
  const navigate = useNavigate();
  const { login, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'wallet' | 'profile'>('wallet');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    fullName: '',
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'freelancer' | 'client'>(
    type === 'freelancer-signup' ? 'freelancer' :
    type === 'client-signup' ? 'client' : 'freelancer'
  );

  const isSignUp = type === 'freelancer-signup' || type === 'client-signup' || type === 'signup';

  useEffect(() => {
    // Update selected role when type changes
    if (type === 'freelancer-signup') {
      setSelectedRole('freelancer');
    } else if (type === 'client-signup') {
      setSelectedRole('client');
    }
  }, [type]);

  const getTitle = () => {
    if (type === 'login') return 'Sign In with Coinbase Wallet';
    return isSignUp ? 'Create Your Account' : 'Sign In to Your Account';
  };

  const getSubtitle = () => {
    if (step === 'wallet') {
      return isSignUp
        ? 'Connect your Coinbase Smart Wallet to get started'
        : 'Sign in to continue to your account';
    }
    return 'Complete your profile to start using PeerHire';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!agreeToTerms) {
          toast.error("Please agree to the terms and conditions");
          setIsLoading(false);
          return;
        }

        if (step === 'wallet') {
          setStep('profile');
          setIsLoading(false);
          return;
        }

        const profile = selectedRole === 'freelancer' ? {
          skills: formData.skills?.split(',').map(s => s.trim()) || [],
          bio: formData.bio || "Professional freelancer",
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate.toString()) : 50,
          location: formData.location || "Remote"
        } : {
          companySize: formData.companySize || "1-10",
          industry: formData.industry || "Technology",
          companyLocation: formData.companyLocation || "Remote"
        };

        await signUp(
          formData.email,
          formData.password,
          selectedRole,
          formData.fullName || "User",
          profile
        );

        toast.success("Account created successfully!");
      } else {
        await login(formData.email, formData.password);
        toast.success("Logged in successfully!");
      }
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      if (isSignUp) {
        setStep('profile');
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to connect wallet");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 py-12 px-4 pt-32 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <div className="bg-secondary px-6 py-4 text-white">
            <h2 className="text-xl font-bold">{getTitle()}</h2>
            <p className="text-white/80 text-sm mt-1">{getSubtitle()}</p>
          </div>

          {isSignUp && step === 'profile' && (
            <div className="mb-6 px-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">I want to join as:</h2>
              <div className="flex space-x-4">
                <div
                  className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedRole === 'freelancer'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRole('freelancer')}
                >
                  <div className="flex items-center mb-2">
                    <Briefcase className={`w-5 h-5 mr-2 ${selectedRole === 'freelancer' ? 'text-primary' : 'text-gray-500'}`} />
                    <h3 className={`font-medium ${selectedRole === 'freelancer' ? 'text-primary' : 'text-gray-900'}`}>Freelancer</h3>
                  </div>
                  <p className="text-sm text-gray-600">I want to work on projects and find jobs</p>
                </div>

                <div
                  className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedRole === 'client'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRole('client')}
                >
                  <div className="flex items-center mb-2">
                    <Users className={`w-5 h-5 mr-2 ${selectedRole === 'client' ? 'text-primary' : 'text-gray-500'}`} />
                    <h3 className={`font-medium ${selectedRole === 'client' ? 'text-primary' : 'text-gray-900'}`}>Client</h3>
                  </div>
                  <p className="text-sm text-gray-600">I want to hire talent and post jobs</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <form onSubmit={handleEmailAuth}>
              {step === 'wallet' ? (
                <div className="space-y-6">
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <div className="flex items-start">
                      <BaseIcon className="w-5 h-5 text-primary mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Base Network Integration</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Connect securely with Coinbase Smart Wallet for instant payments and verification on the Base network.
                        </p>
                      </div>
                    </div>
                  </div>

                  <CustomButton
                    fullWidth
                    size="lg"
                    leftIcon={<BaseIcon className="w-5 h-5" />}
                    onClick={handleConnectWallet}
                  >
                    Connect Coinbase Wallet
                  </CustomButton>

                  <div className="flex items-center">
                    <div className="flex-grow h-px bg-gray-200"></div>
                    <span className="mx-4 text-sm text-gray-500">or</span>
                    <div className="flex-grow h-px bg-gray-200"></div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {isSignUp && (
                      <div className="flex items-start">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                          I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and{' '}
                          <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </label>
                      </div>
                    )}

                    <CustomButton
                      fullWidth
                      variant="secondary"
                      size="lg"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Please wait...' : (isSignUp ? 'Continue' : 'Sign In with Email')}
                    </CustomButton>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <button
                    type="button"
                    onClick={() => setStep('wallet')}
                    className="text-primary hover:text-primary/80 flex items-center text-sm font-medium"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {selectedRole === 'freelancer' ? (
                      <>
                        <div>
                          <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
                            Professional Headline
                          </label>
                          <input
                            type="text"
                            id="headline"
                            name="headline"
                            value={formData.headline}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                            Hourly Rate (USD)
                          </label>
                          <input
                            type="number"
                            id="hourlyRate"
                            name="hourlyRate"
                            value={formData.hourlyRate || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                            Skills (separated by commas)
                          </label>
                          <input
                            type="text"
                            id="skills"
                            name="skills"
                            value={formData.skills || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                            Professional Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={formData.bio || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div className="bg-accent/5 p-4 rounded-lg border border-accent/10 flex items-start">
                          <GrokIcon className="w-5 h-5 text-accent mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-accent">Grok AI Tip:</span> Adding portfolio items and detailed work history can increase your chances of getting hired by 70%.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name (optional)
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                            Industry
                          </label>
                          <select
                            id="industry"
                            name="industry"
                            value={formData.industry || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="">Select your industry</option>
                            <option value="tech">Technology</option>
                            <option value="finance">Finance</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="education">Education</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                            Company/Personal Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            value={formData.bio || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-1">
                            Company Size
                          </label>
                          <input
                            type="text"
                            id="companySize"
                            name="companySize"
                            value={formData.companySize || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-1">
                            Company Location
                          </label>
                          <input
                            type="text"
                            id="companyLocation"
                            name="companyLocation"
                            value={formData.companyLocation || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div className="bg-accent/5 p-4 rounded-lg border border-accent/10 flex items-start">
                          <GrokIcon className="w-5 h-5 text-accent mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-accent">Grok AI Tip:</span> Complete profiles attract 3x more quality responses from freelancers and help you find the right match faster.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <CustomButton
                    fullWidth
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Please wait...' : 'Complete Profile'}
                  </CustomButton>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
