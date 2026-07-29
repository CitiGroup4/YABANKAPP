import { useState } from "react";
import { Lock, Mail, User, CreditCard } from "lucide-react";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4">

      {/* Background glow */}
      <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl bottom-0 right-0" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 mb-4">
            <CreditCard className="text-white w-8 h-8" />
          </div>

          <h1 className="text-4xl font-bold text-white">
            Aureon Bank
          </h1>

          <p className="text-slate-400 mt-2">
            Banking built for tomorrow
          </p>
        </div>


        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

          {/* Toggle */}
          <div className="flex bg-black/20 rounded-xl p-1 mb-8">

            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg transition ${
                isLogin
                  ? "bg-white text-slate-900"
                  : "text-white"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg transition ${
                !isLogin
                  ? "bg-white text-slate-900"
                  : "text-white"
              }`}
            >
              Register
            </button>

          </div>


          <h2 className="text-2xl font-semibold text-white mb-6">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>


          <form className="space-y-4">

            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />

                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}


            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />

              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>


            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />

              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-500 transition py-3 rounded-xl text-white font-semibold shadow-lg shadow-blue-600/30"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>

          </form>


          <p className="text-center text-slate-400 text-sm mt-6">
            {isLogin
              ? "New to Aureon?"
              : "Already have an account?"
            }

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 ml-2 hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>

          </p>

        </div>


        <p className="text-center text-slate-500 text-xs mt-6">
          © 2026 Aureon Bank. Secure digital banking.
        </p>

      </div>

    </div>
  );
}

export default Auth;