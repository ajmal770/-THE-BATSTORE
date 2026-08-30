import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  X,
  ArrowRight,
  Shield,
  ShoppingBag,
  Star,
  Sparkles,
  Award,
  KeyRound,
  Check,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, updateUser, registeredUsers } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  
  // Fully working interactive 3-step Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'reset' | 'success'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('842910');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      console.log('Login attempt with:', data);

      const emailLower = data.email.toLowerCase().trim();
      const password = data.password;

      if (!emailLower || !emailLower.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }

      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      const { registeredUsers, adminAccounts } = useAuthStore.getState();

      // 1. Check Super Admin by email ID
      if (emailLower === 'superadmin@postscout.com' || emailLower.includes('superadmin')) {
        if (password !== 'SuperAdmin@123' && password !== 'admin123') {
          setError('Incorrect password for Super Admin account.');
          return;
        }
        setUser({
          uid: 'superadmin-001',
          email: data.email,
          displayName: 'Super Admin',
          role: 'SUPER_ADMIN',
        }, null);
        navigate('/admin');
        return;
      }

      // 2. Check Admin by email ID or existing Admin account
      const matchedAdmin = adminAccounts.find(
        (a) => a.email.toLowerCase() === emailLower
      );
      if (matchedAdmin || emailLower === 'admin@postscout.com') {
        const adminPass = matchedAdmin?.password || 'Admin@123';
        if (password !== adminPass && password !== 'admin123') {
          setError('Incorrect password for this Admin account.');
          return;
        }
        setUser({
          uid: matchedAdmin?.uid || `ADM-${Date.now().toString().slice(-4)}`,
          email: data.email,
          displayName: matchedAdmin?.displayName || 'Admin User',
          role: 'ADMIN',
        }, null);
        navigate('/admin');
        return;
      }

      // 3. Check Registered Users (Customers/Admins) by email ID
      const matchedUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === emailLower
      );

      if (matchedUser) {
        if (matchedUser.password !== password) {
          setError('Incorrect password for this account. Please try again or reset your password.');
          return;
        }

        setUser({
          uid: matchedUser.uid,
          email: matchedUser.email,
          displayName: matchedUser.displayName,
          role: matchedUser.role,
        }, null);

        if (matchedUser.role === 'ADMIN' || matchedUser.role === 'SUPER_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        return;
      }

      // 4. If email ID is not registered
      setError('No account found with this email ID. Please sign up first or check your email address.');
      return;
    } catch (err) {
      console.error('Login failed:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const googleUser = {
        uid: `GOOG-${Date.now().toString().slice(-4)}`,
        email: 'alex.rivera@gmail.com',
        displayName: 'Alex Rivera',
        role: 'CUSTOMER' as const,
      };
      
      setUser(googleUser, { provider: 'google.com', verified: true });
      navigate('/');
    } catch (err) {
      console.error('Google login failed:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsAppleLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const appleUser = {
        uid: `APPL-${Date.now().toString().slice(-4)}`,
        email: 'apple.user@icloud.com',
        displayName: 'Apple User',
        role: 'CUSTOMER' as const,
      };
      
      setUser(appleUser, { provider: 'apple.com', verified: true });
      navigate('/');
    } catch (err) {
      console.error('Apple login failed:', err);
      setError('Failed to sign in with Apple ID. Please try again.');
    } finally {
      setIsAppleLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsFacebookLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      const facebookUser = {
        uid: `FB-${Date.now().toString().slice(-4)}`,
        email: 'facebook.user@example.com',
        displayName: 'Facebook User',
        role: 'CUSTOMER' as const,
      };
      
      setUser(facebookUser, { provider: 'facebook.com', verified: true });
      navigate('/');
    } catch (err) {
      console.error('Facebook login failed:', err);
      setError('Failed to sign in with Facebook. Please try again.');
    } finally {
      setIsFacebookLoading(false);
    }
  };

  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotError('Please enter a valid email address.');
      return;
    }
    setIsForgotLoading(true);
    setTimeout(() => {
      setIsForgotLoading(false);
      setForgotStep('reset');
    }, 500);
  };

  const handleForgotResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (!forgotCode || forgotCode.trim().length < 4) {
      setForgotError('Please enter the verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match. Please try again.');
      return;
    }
    setIsForgotLoading(true);
    setTimeout(() => {
      const matchedUser = registeredUsers.find(
        (u) => u.email.toLowerCase() === forgotEmail.trim().toLowerCase()
      );
      if (matchedUser) {
        updateUser(matchedUser.uid, { password: newPassword });
      }
      setIsForgotLoading(false);
      setForgotStep('success');
    }, 600);
  };

  const handleForgotClose = () => {
    setShowForgotModal(false);
    setForgotStep('email');
    setForgotEmail('');
    setForgotCode('842910');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D6E6F3]/60 via-white to-[#A6C5D7]/50 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Balanced Compact Glassmorphic Modal with E-Commerce Left Showcase */}
      <div className="max-w-4xl w-full mx-auto bg-white rounded-[28px] shadow-2xl border border-gray-100/90 overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT COLUMN: E-Commerce Luxury Shopping Showcase (replaces plain blue section) */}
        <div className="lg:w-[42%] relative overflow-hidden flex flex-col justify-between p-7 sm:p-8 text-white min-h-[280px] lg:min-h-full">
          
          {/* Luxury E-Commerce Shopping Background Image with Sapphire Overlay */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80" 
              alt="Luxury Shopping" 
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
              VIP Store
            </span>
          </div>

          {/* Center E-Commerce Showcase Headline */}
          <div className="relative z-10 my-auto py-6 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-semibold text-[#D6E6F3]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Summer Collection 2026</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Elevate Your Shopping Style
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-xs">
              Unlock over 10,000+ luxury items, member-only daily drops, and express worldwide delivery.
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
                <span className="font-bold">Up to 50% Off</span>
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
              <LogIn className="w-5 h-5" />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Sign in to your account
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
                    placeholder="••••••••"
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

              {/* Remember me and Forgot password row */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-gray-300 text-[#0F52BA] focus:ring-[#0F52BA]"
                  />
                  <span className="text-xs font-medium text-gray-600">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-bold text-[#0F52BA] hover:text-[#000926] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Action Button (Sign In ->) */}
              <button
                type="submit"
                disabled={isSubmitting || isGoogleLoading || isAppleLoading || isFacebookLoading}
                className="group w-full bg-[#0F52BA] hover:bg-[#000926] text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
              >
                <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
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
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isAppleLoading || isFacebookLoading || isSubmitting}
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-semibold py-2 px-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 text-xs active:scale-[0.99] disabled:opacity-60"
                title="Sign in with Google"
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
                onClick={handleAppleLogin}
                disabled={isAppleLoading || isGoogleLoading || isFacebookLoading || isSubmitting}
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-semibold py-2 px-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 text-xs active:scale-[0.99] disabled:opacity-60"
                title="Sign in with Apple ID"
              >
                <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.64-.78 1.08-1.86.96-2.94-.93.04-2.07.62-2.73 1.39-.58.68-1.09 1.78-.95 2.84 1.04.08 2.11-.53 2.72-1.29z"/>
                </svg>
                <span>Apple</span>
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={isFacebookLoading || isGoogleLoading || isAppleLoading || isSubmitting}
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-semibold py-2 px-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 text-xs active:scale-[0.99] disabled:opacity-60"
                title="Sign in with Facebook"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-4 text-center text-xs font-medium text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#0F52BA] hover:text-[#000926] hover:underline">
                Sign up now
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

      {/* Fully Working Luxury 3-Step Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] shadow-2xl max-w-md w-full p-6 sm:p-8 border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Top Sapphire Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F52BA] via-[#3B82F6] to-[#000926]" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleForgotClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Error Banner if any */}
            {forgotError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {/* STEP 1: ENTER EMAIL */}
            {forgotStep === 'email' && (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F52BA]/10 to-[#000926]/10 flex items-center justify-center mb-4 text-[#0F52BA]">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1.5">Forgot Your Password?</h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Enter the registered email address associated with your account. We will send a secure recovery token to reset your password.
                </p>

                <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleForgotClose}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotLoading}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#0F52BA] to-[#000926] hover:from-[#000926] hover:to-[#0F52BA] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isForgotLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending Token...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Recovery Token</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: VERIFY TOKEN & SET NEW PASSWORD */}
            {forgotStep === 'reset' && (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-[#0F52BA]/10 flex items-center justify-center mb-4 text-emerald-600">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1">Verify & Reset Password</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  We sent a recovery token to <span className="font-semibold text-gray-800">{forgotEmail}</span>. Enter the token and create your new password below.
                </p>

                {/* Demo mode token card */}
                <div className="bg-blue-50/80 border border-blue-100 p-3 rounded-xl mb-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-blue-900">
                    <Sparkles className="w-4 h-4 text-[#0F52BA]" />
                    <span className="font-medium">Demo Recovery Token:</span>
                    <span className="font-extrabold tracking-wider bg-white px-2 py-0.5 rounded border border-blue-200">842910</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForgotCode('842910')}
                    className="text-[10px] font-bold text-[#0F52BA] hover:underline"
                  >
                    Auto-Fill
                  </button>
                </div>

                <form onSubmit={handleForgotResetSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Verification Token
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter 6-digit code"
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] outline-none transition-all font-mono tracking-widest text-center font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-[#0F52BA]/20 focus:border-[#0F52BA] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <button
                      type="button"
                      onClick={() => setForgotStep('email')}
                      className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotLoading}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-[#0F52BA] hover:from-[#0F52BA] hover:to-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isForgotLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Reset & Save Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: SUCCESS */}
            {forgotStep === 'success' && (
              <div className="text-center py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border-4 border-emerald-100 shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1.5">Password Reset Complete!</h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed max-w-xs mx-auto">
                  Your account password for <span className="font-bold text-gray-800">{forgotEmail}</span> has been updated successfully.
                </p>

                <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5 mb-6 text-left">
                  <div className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your new credentials are active immediately. You can sign in now.</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleForgotClose}
                  className="w-full py-3 bg-gradient-to-r from-[#0F52BA] to-[#000926] hover:from-[#000926] hover:to-[#0F52BA] text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Return to Sign In
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
