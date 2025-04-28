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

interface ValidationError {
  path: string;
  message: string;
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic validation
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (isSignUp && !formData.fullName?.trim()) {
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

        if (!formData.hourlyRate) {
          newErrors.hourlyRate = 'Please set your hourly rate';
        } else {
          const rate = parseFloat(formData.hourlyRate);
          if (isNaN(rate) || rate < 1) {
            newErrors.hourlyRate = 'Hourly rate must be at least $1';
          } else if (rate > 1000) {
            newErrors.hourlyRate = 'Hourly rate cannot exceed $1000';
          }
        }

        if (!formData.skills?.trim()) {
          newErrors.skills = 'Please add at least one skill';
        } else {
          const skills = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
          if (skills.length === 0) {
            newErrors.skills = 'Please add at least one valid skill';
          } else if (skills.some(s => s.length < 2)) {
            newErrors.skills = 'Each skill should be at least 2 characters';
          }
        }

        if (!formData.bio?.trim()) {
          newErrors.bio = 'Please write a professional bio';
        } else if (formData.bio.length < 50) {
          newErrors.bio = 'Bio should be at least 50 characters. Describe your experience and expertise.';
        } else if (formData.bio.length > 500) {
          newErrors.bio = 'Bio should not exceed 500 characters';
        }

        if (!formData.location?.trim()) {
          newErrors.location = 'Please add your location';
        } else if (formData.location.length < 2) {
          newErrors.location = 'Please enter a valid location';
        }
      } else {
        if (!formData.industry?.trim()) newErrors.industry = 'Industry is required';
        if (!formData.companySize?.trim()) newErrors.companySize = 'Company size is required';
        if (!formData.companyLocation?.trim()) newErrors.companyLocation = 'Company location is required';
        if (!formData.bio?.trim()) newErrors.bio = 'Company description is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

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

        // Validate form before submission
        if (!validateForm()) {
          setIsLoading(false);
          // Show first error in toast
          const firstError = Object.values(errors)[0];
          if (firstError) {
            toast.error(firstError);
          }
          return;
        }

        const profile = selectedRole === 'freelancer' ? {
          skills: formData.skills?.split(',').map(s => s.trim()) || [],
          bio: formData.bio || "",
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
          location: formData.location || ""
        } : {
          companySize: formData.companySize || "",
          industry: formData.industry || "",
          companyLocation: formData.companyLocation || "",
          bio: formData.bio || ""
        };

        try {
          await signUp(
            formData.email,
            formData.password,
            selectedRole,
            formData.fullName,
            profile
          );
          toast.success("Account created successfully!");
          navigate('/dashboard');
        } catch (error: any) {
          if (error.response?.data?.details) {
            const validationErrors: ValidationError[] = error.response.data.details;
            const errorMap: Record<string, string> = {};
            
            validationErrors.forEach(err => {
              const field = err.path.split('.').pop() || '';
              errorMap[field] = err.message;

              // Map nested profile errors to form fields
              if (err.path.includes('profile.')) {
                const profileField = err.path.split('.').pop() || '';
                errorMap[profileField] = err.message;
              }
            });
            
            setErrors(errorMap);
            
            // Show the first error in a toast
            if (validationErrors.length > 0) {
              toast.error(validationErrors[0].message);
            }
          } else {
            toast.error(error.message || "Failed to create account");
          }
        }
      } else {
        await login(formData.email, formData.password);
        toast.success("Logged in successfully!");
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error(error);
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

  const renderInput = (name: string, label: string, type: string = 'text', placeholder?: string, options?: string[]) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={formData[name as keyof FormData] || ''}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors[name] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">{`Select ${label.toLowerCase()}`}</option>
            {options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={formData[name as keyof FormData] || ''}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors[name] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={placeholder}
          />
        ) : (
          <>
            <input
              type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
              id={name}
              name={name}
              value={formData[name as keyof FormData] || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors[name] ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={placeholder}
            />
            {type === 'password' && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            )}
          </>
        )}
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

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
                    {renderInput('fullName', 'Full Name')}

                    {selectedRole === 'freelancer' ? (
                      <>
                        {renderInput('headline', 'Professional Headline')}
                        {renderInput('hourlyRate', 'Hourly Rate (USD)', 'number')}
                        {renderInput('skills', 'Skills (separated by commas)')}
                        {renderInput('bio', 'Professional Bio', 'textarea')}
                        {renderInput('location', 'Location')}
                      </>
                    ) : (
                      <>
                        {renderInput('company', 'Company Name (optional)')}
                        {renderInput('industry', 'Industry', 'select', undefined, [
                          'Technology',
                          'Finance',
                          'Healthcare',
                          'Education',
                          'E-commerce',
                          'Other'
                        ])}
                        {renderInput('bio', 'Company Description', 'textarea')}
                        {renderInput('companySize', 'Company Size', 'select', undefined, [
                          '1-10',
                          '11-50',
                          '51-200',
                          '201-500',
                          '500+'
                        ])}
                        {renderInput('companyLocation', 'Company Location')}
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
