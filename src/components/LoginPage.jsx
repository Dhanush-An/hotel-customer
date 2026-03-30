import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Lock, Mail, ChevronRight } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden font-sans text-white p-4" 
      style={{ 
        backgroundImage: `url('/images/hero.png')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md duration-700">
        <div className="glass-dark p-8 rounded-2xl shadow-2xl backdrop-blur-2xl border border-white/10">
          <div className="mb-8 text-center">
             <Link to="/" className="text-3xl font-bold tracking-tighter uppercase leading-none block mb-2">HOTEL GLITZ SUITS</Link>
             <p className="text-sm font-light tracking-[0.2em] opacity-60 uppercase">MEMBER LOGIN</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <Phone size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="MOBILE NUMBER" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm tracking-widest placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="PASSWORD" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm tracking-widest placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] tracking-widest uppercase opacity-60">
              <label className="flex items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity">
                <input type="checkbox" className="accent-indigo-500" />
                <span>Remember me</span>
              </label>
              <a href="#" className="hover:opacity-100 transition-opacity">Forgot password?</a>
            </div>

            <Link 
              to="/dashboard"
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-xl text-xs font-bold tracking-[0.3em] uppercase transition-all hover:bg-white/90 active:scale-95 shadow-lg shadow-white/10"
            >
              Sign In
              <ChevronRight size={16} />
            </Link>
          </form>

          <div className="mt-8 text-center">
             <div className="relative flex items-center gap-4 mb-8">
                <div className="h-[1px] flex-1 bg-white/10"></div>
                <span className="text-[10px] uppercase tracking-widest opacity-30">or continue with</span>
                <div className="h-[1px] flex-1 bg-white/10"></div>
             </div>

             <div className="flex justify-center gap-4">
                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                   <Mail size={20} />
                </button>
             </div>

             <p className="mt-8 text-xs font-light tracking-widest opacity-60">
               NOT A MEMBER YET? <Link to="/register" className="font-bold text-white hover:underline underline-offset-4 decoration-indigo-400">JOIN NOW</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
