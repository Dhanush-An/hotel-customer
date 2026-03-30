import React from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Phone, ChevronRight, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden font-sans text-white p-4" 
      style={{ 
        backgroundImage: `url('/images/hero.png')`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-lg duration-700">
        <div className="glass-dark p-8 rounded-2xl shadow-2xl backdrop-blur-2xl border border-white/10">
          <div className="mb-8 text-center">
             <Link to="/" className="text-3xl font-bold tracking-tighter uppercase leading-none block mb-2">HOTEL GLITZ SUITS</Link>
             <p className="text-sm font-light tracking-[0.2em] opacity-60 uppercase">JOIN AS A MEMBER</p>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6 col-span-1 md:col-span-2">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="FULL NAME" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm tracking-widest placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                />
              </div>

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

            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="CONFIRM PASSWORD" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm tracking-widest placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-6 mt-4">
              <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase opacity-60">
                 <input type="checkbox" className="accent-indigo-500" />
                 <span>I AGREE TO THE <a href="#" className="underline hover:text-white hover:opacity-100">TERMS & CONDITIONS</a></span>
              </div>

              <Link 
                to="/dashboard"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl text-xs font-bold tracking-[0.3em] uppercase transition-all hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-600/20"
              >
                Create Account
                <UserPlus size={16} />
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center">
             <p className="text-xs font-light tracking-widest opacity-60">
               ALREADY A MEMBER? <Link to="/login" className="font-bold text-white hover:underline underline-offset-4 decoration-indigo-400">SIGN IN</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
