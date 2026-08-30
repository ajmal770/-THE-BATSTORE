import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  AlertCircle,
  X,
  ArrowRight,
  ShoppingBag,
  Shield,
  Star,
  Sparkles,
  Award
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCustomerStore } from '../store/customerStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { addCustomer } = useCustomerStore();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      console.log('Registration attempt with:', data);
      
      const { registerUser } = useAuthStore.getState();
      const registrationResult = registerUser({
        email: data.email,
        password: data.password,
        displayName: data.name,
      });

      if (!registrationResult.success) {
        setError(registrationResult.error || 'Registration failed');
        return;
      }
      
      const createdUid = registrationResult.user?.uid || `USR-${Date.now().toString().slice(-4)}`;
      setUser({
        uid: createdUid,
        email: data.email,
        displayName: data.name,
        role: 'CUSTOMER',
      }, null);
      
      addCustomer({
        name: data.name,
        email: data.email,
        role: 'CUSTOMER',
        status: 'Active',
      });

      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const mockUid = `GOOG-${Date.now().toString().slice(-4)}`;
      const googleName = 'Alex Rivera';
      const googleEmail = 'alex.rivera@gmail.com';

      setUser({
        uid: mockUid,
        email: googleEmail,
        displayName: googleName,
        role: 'CUSTOMER',
      }, { provider: 'google.com', verified: true });

      addCustomer({
        name: googleName,
        email: googleEmail,
        role: 'CUSTOMER',
        status: 'Active',
      });

      navigate('/');
    } catch (err) {
      console.error('Google sign-up failed:', err);
      setError('Failed to create account with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setIsAppleLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const mockUid = `APPL-${Date.now().toString().slice(-4)}`;
      const appleName = 'Apple User';
      const appleEmail = 'apple.user@icloud.com';

      setUser({
        uid: mockUid,
        email: appleEmail,
        displayName: appleName,
        role: 'CUSTOMER',
      }, { provider: 'apple.com', verified: true });

      addCustomer({
        name: appleName,
        email: appleEmail,
        role: 'CUSTOMER',
        status: 'Active',
      });

      navigate('/');
    } catch (err) {
      console.error('Apple sign-up failed:', err);
      setError('Failed to create account with Apple ID. Please try again.');
    } finally {
      setIsAppleLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    setIsFacebookLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const mockUid = `FB-${Date.now().toString().slice(-4)}`;
      const fbName = 'Facebook User';
      const fbEmail = 'facebook.user@example.com';

      setUser({
        uid: mockUid,
        email: fbEmail,
        displayName: fbName,
        role: 'CUSTOMER',
      }, { provider: 'facebook.com', verified: true });

      addCustomer({
        name: fbName,
        email: fbEmail,
        role: 'CUSTOMER',
        status: 'Active',
      });

      navigate('/');
    } catch (err) {
      console.error('Facebook sign-up failed:', err);
      setError('Failed to create account with Facebook. Please try again.');
    } finally {
  setIsFacebookLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D6E6F3]/60 via-white to-[#A6C5D7]/50 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Balanced Compact Glassmorphic Modal with E-Commerce Left Showcase */}
      <div className="max-w-4xl w-full mx-auto bg-white rounded-[28px] shadow-2xl border border-gray-100/90 overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT COLUMN: E-Commerce Luxury Shopping Showcase */}
        <div className="lg:w-[42%] relative overflow-hidden flex flex-col justify-between p-7 sm:p-8 text-white min-h-[280px] lg:min-h-full">
          
          {/* Luxury E-Commerce Shopping Background Image with Sapphire Overlay */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80" 
              alt="Luxury E-Commerce" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000926]/95 via-[#000926]/80 to-[#0F52BA]/65 backdrop-blur-[2px]" />
          </div>

          {/* Top Brand Logo & VIP Member Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-sm group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">ShopEase</span>
            </Link>
            <span className="bg-[#D6E6F3]/25 backdrop-blur-md text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/30">
              New Member
            </span>
          </div>

          {/* Center E-Commerce Showcase Headline */}
          <div className="relative z-10 my-auto py-6 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-semibold text-[#D6E6F3]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join 10,000+ VIP Shoppers</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Unlock Exclusive VIP Shopping
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-xs">
              Create your account today to enjoy daily member drops, wishlist tracking, and 20% off your first order.
            </p>
          </div>

          {/* Bottom Compact E-Commerce Perks & Rating */}
          <div className="relative z-10 space-y-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#D6E6F3]" />
                <span className="font-bold">10k+ Products</span>
              </div>
              <span className="text-white/40">|</span>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="font-bold">Free Shipping</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-300">
              <div className="flex -space-x-1.5 overflow-hidden">
                <img className="inline-block h-5 w-5 rounded-full ring-1 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="Customer" />
                <img className="inline-block h-5 w-5 rounded-full ring-1 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Customer" />
                <img className="inline-block h-5 w-5 rounded-full ring-1 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Customer" />
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold text-white">4.9/5</span>
                <span>(10k+ reviews)</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Auth Form & Bottom Features Footer */}
        <div className="flex-1 flex flex-col justify-between bg-white">
          
          {/* Top Form Section */}
          <div className="p-6 sm:p-8 text-center">
            
            {/* Round Light-Blue Circular Icon Badge */}
            <div className="w-11 h-11 rounded-full bg-[#D6E6F3]/60 text-[#0F52BA] flex items-center justify-center mx-auto mb-2.5 shadow-sm border border-[#D6E6F3]">
              <UserPlus className="w-5 h-5" />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Join our e-commerce community today
            </p>

            {/* Error Notice */}
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-medium border border-red-200 mb-4 flex items-center justify-between gap-2 text-left">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
                <button type="button" onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Compact Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...register('name')}
                    className={`w-full pl-10 pr-3.5 py-2.5 border rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] outline-none transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-200/90'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    className={`w-full pl-10 pr-3.5 py-2.5 border rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] outline-none transition-all ${
                      errors.email ? 'border-red-500' : 'border-gray-200/90'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    {...register('password')}
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] outline-none transition-all ${
                      errors.password ? 'border-red-500' : 'border-gray-200/90'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    {...register('confirmPassword')}
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 bg-white focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] outline-none transition-all ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-200/90'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  required
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300 text-[#0F52BA] focus:ring-[#0F52BA]"
                />
                <span className="text-xs font-medium text-gray-600">
                  I agree to the <a href="#" className="text-[#0F52BA] underline font-bold">Terms of Service</a> & <a href="#" className="text-[#0F52BA] underline font-bold">Privacy Policy</a>
                </span>
              </div>

              {/* Primary Action Button (Create Account ->) */}
              <button
                type="submit"
                disabled={isSubmitting || isGoogleLoading || isAppleLoading || isFacebookLoading}
                className="group w-full bg-[#0F52BA] hover:bg-[#000926] text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
              >
                <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Divider: or continue with */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">or continue with</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* COMPACT 3-COLUMN SOCIAL LOGIN ROW (Saves height & looks ultra-sleek) */}
            <div className="grid grid-cols-3 gap-2">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading || isAppleLoading || isFacebookLoading || isSubmitting}
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-semibold py-2 px-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 text-xs active:scale-[0.99] disabled:opacity-60"
                title="Sign up with Google"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24Z" />
                  <path fill="#FBBC05" d="M5.28 14.24a7.13 7.13 0 0 1 0-4.48V6.61H1.29a11.96 11.96 0 0 0 0 10.78l3.99-3.15Z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96Z" />
                </svg>
                <span>Google</span>
              </button>

              {/* Apple ID Button */}
              <button
                type="button"
                onClick={handleAppleSignUp}
                disabled={isAppleLoading || isGoogleLoading || isFacebookLoading || isSubmitting}
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-semibold py-2 px-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 text-xs active:scale-[0.99] disabled:opacity-60"
                title="Sign up with Apple ID"
              >
                <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.64-.78 1.08-1.86.96-2.94-.93.04-2.07.62-2.73 1.39-.58.68-1.09 1.78-.95 2.84 1.04.08 2.11-.53 2.72-1.29z"/>
                </svg>
                <span>Apple ID</span>
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                onClick={handleFacebookSignUp}
                disabled={isFacebookLoading || isGoogleLoading || isAppleLoading || isSubmitting}
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-semibold py-2 px-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 text-xs active:scale-[0.99] disabled:opacity-60"
                title="Sign up with Facebook"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-4 text-center text-xs font-medium text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#0F52BA] hover:text-[#000926] hover:underline">
                Sign in
              </Link>
            </div>

          </div>

          {/* BOTTOM FOOTER: Clean Security Badge */}
          <div className="bg-[#F8FAFC] border-t border-gray-100 py-3.5 px-5 rounded-b-[28px] flex items-center justify-center gap-2 text-[11px] font-semibold text-gray-500">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL encrypted & protected by advanced security</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;

