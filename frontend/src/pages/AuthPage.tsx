import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CustomButton } from '@/components/ui/custom-button';
import { WalletConnect } from '@/components/ui/wallet-connect';
import { BaseIcon, GroqIcon } from '@/components/icons';
import { Eye, EyeOff, ChevronLeft, Briefcase, Users, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useWallet } from '@/hooks/use-wallet';
import api from '@/lib/api';
import { CACHE_KEYS } from '@/context/AuthContext';
import { cacheUtils } from '@/lib/utils';

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
  walletAddress?: string;
  walletData?: any;
}

interface ValidationError {
  path: string;
  message: string;
}

interface WalletData {
  address: string;
  signature: string;
  message: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ type = 'signup' }) => {
  const navigate = useNavigate();
  const { login, signUp } = useAuth();
  const { connect, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'initial' | 'profile'>('initial');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    const cachedData = localStorage.getItem('signup_form_data');
    return cachedData ? JSON.parse(cachedData) : {
      email: '',
      password: '',
      fullName: '',
    };
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'freelancer' | 'client'>(() => {
    const cachedRole = localStorage.getItem('selected_role');
    return (cachedRole as 'freelancer' | 'client') || (
      type === 'freelancer-signup' ? 'freelancer' :
        type === 'client-signup' ? 'client' : 'freelancer'
    );
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isSignUp = type === 'freelancer-signup' || type === 'client-signup' || type === 'signup';

  useEffect(() => {
    // Update selected role when type changes and cache it
    if (type === 'freelancer-signup') {
      setSelectedRole('freelancer');
      localStorage.setItem('selected_role', 'freelancer');
    } else if (type === 'client-signup') {
      setSelectedRole('client');
      localStorage.setItem('selected_role', 'client');
    }
  }, [type]);

  // Cache form data when it changes
  useEffect(() => {
    localStorage.setItem('signup_form_data', JSON.stringify(formData));
  }, [formData]);

  // Cache selected role when it changes
  useEffect(() => {
    localStorage.setItem('selected_role', selectedRole);
  }, [selectedRole]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Skip email/password validation if using wallet authentication
    if (!walletData) {
      // Basic validation
      if (!formData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
    }

    // Email and password are always required
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password && isSignUp) {
      newErrors.password = 'Password is required';
    }

    if (isSignUp && !formData.fullName?.trim() && step === 'profile') {
      newErrors.fullName = 'Full name is required';
    }

    // Profile specific validation
    if (step === 'profile') {
      if (selectedRole === 'freelancer') {
        if (!formData.headline?.trim()) {
          newErrors.headline = 'Please add a professional headline (e.g., "Senior Full Stack Developer")';
        } else if (formData.headline.length < 5) {
          newErrors.headline = 'Headline should be at least 5 characters';
        }

        if (!formData.bio?.trim()) {
          newErrors.bio = 'Please provide a professional bio';
        } else if (formData.bio.length < 50) {
          newErrors.bio = 'Bio should be at least 50 characters';
        }

        if (!formData.skills?.trim()) {
          newErrors.skills = 'Please add at least one skill';
        }
      } else if (selectedRole === 'client') {
        if (!formData.company?.trim()) {
          newErrors.company = 'Company name is required';
        }

        if (!formData.industry?.trim()) {
          newErrors.industry = 'Please select an industry';
        }

        if (!formData.companySize?.trim()) {
          newErrors.companySize = 'Please select your company size';
        }

        if (!formData.companyLocation?.trim()) {
          newErrors.companyLocation = 'Company location is required';
        }

        if (!formData.bio?.trim()) {
          newErrors.bio = 'Please provide a company description';
        } else if (formData.bio.length < 50) {
          newErrors.bio = 'Company description should be at least 50 characters';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Step management without immediate API calls
    if (step === 'initial') {
      if (!validateForm()) {
        const firstError = Object.values(errors)[0];
        if (firstError) {
          toast.error(firstError);
        }
        return;
      }

      if (isSignUp) {
        if (!agreeToTerms) {
          toast.error("Please agree to the terms and conditions");
          return;
        }
        setStep('profile');
        return;
      }
    }

    // Only proceed with API calls if we're on the profile step or it's a login
    if (!isSignUp || (isSignUp && step === 'profile')) {
      setIsLoading(true);

      try {
        if (isSignUp) {
          // Final validation before API call
          if (!validateForm()) {
            const firstError = Object.values(errors)[0];
            if (firstError) {
              toast.error(firstError);
            }
            setIsLoading(false);
            return;
          }

          // Prepare profile data
          const profile = selectedRole === 'freelancer' ? {
            skills: formData.skills?.split(',').map(s => s.trim()) || [],
            bio: formData.bio || "",
            hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
            location: formData.location || ""
          } : {
            company: formData.company || "",
            industry: formData.industry || "",
            companySize: formData.companySize || "",
            companyLocation: formData.companyLocation || "",
            bio: formData.bio || ""
          };

          // Handle wallet-based signup
          if (walletData) {
            const walletSignupPayload = {
              address: walletData.address,
              signature: walletData.signature,
              message: walletData.message,
              name: formData.fullName,
              email: formData.email,
              role: selectedRole,
              password: formData.password,
              profile
            };

            const response = await api.post("/auth/wallet/signup", walletSignupPayload);
            const { token, user } = response.data;

            cacheUtils.secureCookie.set(CACHE_KEYS.AUTH_TOKEN, token);
            cacheUtils.localStorage.set(CACHE_KEYS.USER, user);
            cacheUtils.localStorage.remove('peerhire:walletData');

            toast.success("Account created successfully with wallet!");
            navigate('/dashboard');
          } else {
            // Regular email signup
            await signUp(formData.email, formData.password, selectedRole, formData.fullName, profile);
            toast.success("Account created successfully!");
            navigate('/dashboard');
          }
        } else {
          // Login logic
          if (walletData) {
            const response = await api.post("auth/wallet", {
              address: walletData.address,
              signature: walletData.signature,
              message: walletData.message
            });

            const { token } = response.data;
            cacheUtils.secureCookie.set(CACHE_KEYS.AUTH_TOKEN, token);
            toast.success("Logged in successfully with wallet!");
            navigate('/dashboard');
          } else {
            await login(formData.email, formData.password);
            toast.success("Logged in successfully!");
            navigate('/dashboard');
          }
        }
      } catch (error: any) {
        console.error(error);
        if (error.response?.data?.details) {
          const validationErrors = error.response.data.details;
          const errorMap: Record<string, string> = {};

          validationErrors.forEach((err: ValidationError) => {
            const field = err.path.split('.').pop() || '';
            errorMap[field] = err.message;

            if (err.path.includes('profile.')) {
              const profileField = err.path.split('.').pop() || '';
              errorMap[profileField] = err.message;
            }
          });

          setErrors(errorMap);
          toast.error(validationErrors[0].message);
        } else {
          toast.error(error.message || "Authentication failed");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleWalletSignup = async () => {
    try {
      setIsConnecting(true);
      const data = await connect();

      if (data) {
        // Store wallet data in component state
        setWalletData(data);

        // If this is login page, attempt immediate login
        if (!isSignUp) {
          try {
            setIsLoading(true);
            // Attempt wallet login
            const response = await api.post("auth/wallet", {
              address: data.address,
              signature: data.signature,
              message: data.message
            });

            const { token, user } = response.data;

            // Store token in secure cookie
            cacheUtils.secureCookie.set(CACHE_KEYS.AUTH_TOKEN, token);
            // Store user data with proper caching
            cacheUtils.localStorage.set(CACHE_KEYS.USER, user);

            toast.success("Logged in successfully with wallet!");
            // Navigate based on user role
            navigate(user.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/client');
          } catch (error: any) {
            if (error.response?.status === 404 && error.response?.data?.needsRegistration) {
              toast.error("No account linked to this wallet. Please sign up first.");
              navigate('/auth/signup');
            } else {
              toast.error(error.response?.data?.error || error.message || "Authentication failed");
            }
            // Clear wallet data on error
            setWalletData(null);
            disconnect();
          } finally {
            setIsLoading(false);
          }
        } else {
          // For signup, cache wallet data and proceed to next step
          cacheUtils.localStorage.set('peerhire:walletData', data);
          toast.success('Wallet connected successfully! Continue filling out your details.');
          setStep('profile');
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRoleSelect = (role: 'freelancer' | 'client') => {
    setSelectedRole(role);
    // Clear any role-specific form fields when switching roles
    setFormData(prev => ({
      ...prev,
      headline: '',
      hourlyRate: '',
      skills: '',
      company: '',
      industry: '',
      companySize: '',
      companyLocation: '',
      bio: '',
      location: ''
    }));
  };

  const renderInput = (name: string, label: string, type: string = 'text', placeholder?: string, options?: string[]) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={formData[name as keyof FormData] || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
            rows={4}
          />
        ) : type === 'select' ? (
          <select
            id={name}
            name={name}
            value={formData[name as keyof FormData] || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
            className={`w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          >
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : type === 'password' ? (
          <div className="relative">
            <input
              id={name}
              name={name}
              type={showPassword ? 'text' : 'password'}
              value={formData[name as keyof FormData] || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
              placeholder={placeholder}
              className={`w-full pl-3 pr-10 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={formData[name as keyof FormData] || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          />
        )}
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-28 pb-12">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-10">

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? (
              <>
                Join the leading platform for Base blockchain developers
              </>
            ) : (
              <>
                Sign in to access your account
              </>
            )}
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          {isSignUp && (
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => handleRoleSelect('freelancer')}
                className={`flex-1 px-4 py-4 text-center focus:outline-none transition-all ${selectedRole === 'freelancer'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className="flex flex-col items-center">
                  <Briefcase className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">I'm a Freelancer</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('client')}
                className={`flex-1 px-4 py-4 text-center focus:outline-none transition-all ${selectedRole === 'client'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className="flex flex-col items-center">
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">I'm a Client</span>
                </div>
              </button>
            </div>
          )}

          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {step === 'profile' && (
                <button
                  type="button"
                  onClick={() => setStep('initial')}
                  className="text-primary hover:text-primary/80 flex items-center text-sm font-medium"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
              )}

              {walletData && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Wallet Connected: {walletData.address.substring(0, 6)}...{walletData.address.substring(walletData.address.length - 4)}
                      </p>
                      <p className="text-xs text-green-700 mt-0.5">
                        {isSignUp
                          ? "Complete your details to create an account"
                          : "Your account will be verified using this wallet"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === 'profile' ? (
                <div className="space-y-4">
                  {renderInput('fullName', 'Full Name')}

                  {selectedRole === 'freelancer' ? (
                    <>
                      {renderInput('headline', 'Professional Headline')}
                      {renderInput('hourlyRate', 'Hourly Rate (ETH)', 'number')}
                      {renderInput('skills', 'Skills (separated by commas)')}
                      {renderInput('bio', 'Professional Bio', 'textarea')}
                      {renderInput('location', 'Location')}
                    </>
                  ) : (
                    <>
                      {renderInput('company', 'Company Name')}
                      {renderInput('industry', 'Industry', 'select', undefined, [
                        'Technology',
                        'Finance',
                        'Healthcare',
                        'Education',
                        'E-commerce',
                        'Blockchain',
                        'Entertainment',
                        'Other',
                      ])}
                      {renderInput('companySize', 'Company Size', 'select', undefined, [
                        '1-10',
                        '11-50',
                        '51-200',
                        '201-500',
                        '500+',
                      ])}
                      {renderInput('bio', 'Company Description', 'textarea')}
                      {renderInput('companyLocation', 'Company Location')}
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {isSignUp && (
                    <>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <BaseIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium text-gray-900">Base Network Integration</h3>
                            <p className="mt-1 text-sm text-gray-600">
                              Connect securely with Coinbase Smart Wallet for instant payments and verification on the Base network.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 mb-6">
                        <CustomButton
                          type="button"
                          variant="outline"
                          size="lg"
                          onClick={handleWalletSignup}
                          disabled={isConnecting}
                          className="w-full flex items-center justify-center"
                        >
                          {isConnecting ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Connecting Wallet...
                            </span>
                          ) : (
                            <>
                              <BaseIcon className="w-5 h-5 mr-2" />
                              Continue with Coinbase Wallet
                            </>
                          )}
                        </CustomButton>
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-4">
                    {renderInput('email', 'Email', 'email', 'Enter your email')}
                    {renderInput('password', 'Password', 'password', 'Enter your password')}

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
              )}

              {step === 'profile' && (
                <div className="mt-6">
                  <CustomButton
                    fullWidth
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </CustomButton>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Link to="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link to="/auth/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
