import React, { useState } from 'react';

interface AuthProps {
  onAuthSuccess: (username: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = loginEmail.trim() ? loginEmail.split('@')[0] : 'Alex Morgan';
    onAuthSuccess(displayName);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName =
      regName.trim() || (regEmail.trim() ? regEmail.split('@')[0] : 'Alex Morgan');
    onAuthSuccess(displayName);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 sm:p-6 font-sans select-none relative overflow-hidden">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Auth Card */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-orange-50/90 to-amber-50/50 backdrop-blur-xl border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
        
        {/* Brand Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-700 to-amber-900 text-amber-50 font-bold text-xl rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-600/30">
            B
          </div>
          <h1 className="text-2xl font-extrabold text-amber-950 tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs text-amber-800/70">
            {mode === 'login'
              ? 'Sign in to access your accounts & financial tools'
              : 'Join today and start managing your finances'}
          </p>
        </div>


        {/* --- SIGN IN FORM --- */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-amber-950">
                Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full text-xs px-4 py-3 rounded-xl border border-amber-300/70 bg-white/80 text-amber-950 placeholder-amber-800/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-amber-950">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs text-amber-800 hover:text-amber-950 font-semibold hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs px-4 py-3 rounded-xl border border-amber-300/70 bg-white/80 text-amber-950 placeholder-amber-800/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-800/70 hover:text-amber-950 text-xs font-semibold cursor-pointer px-1 py-0.5"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-800 hover:bg-amber-900 text-amber-50 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-[0.99] border border-amber-900/50 mt-2"
            >
              Sign In to Dashboard
            </button>
          </form>
        )}

        {/* --- SIGN UP FORM --- */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-amber-950">
                Full Name
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-amber-300/70 bg-white/80 text-amber-950 placeholder-amber-800/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-amber-950">
                Email Address
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full text-xs px-4 py-2.5 rounded-xl border border-amber-300/70 bg-white/80 text-amber-950 placeholder-amber-800/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-amber-950">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-amber-300/70 bg-white/80 text-amber-950 placeholder-amber-800/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-amber-950">
                  Confirm
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-amber-300/70 bg-white/80 text-amber-950 placeholder-amber-800/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-amber-800 hover:bg-amber-900 text-amber-50 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-[0.99] border border-amber-900/50"
              >
                Create Account & Continue
              </button>
            </div>
          </form>
        )}

        {/* Footer Link Switcher */}
        <div className="pt-2 border-t border-amber-200/60 text-center">
          <p className="text-xs text-amber-800/80">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-amber-950 font-bold hover:underline cursor-pointer"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-amber-950 font-bold hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>


      </div>
    </div>
  );
};