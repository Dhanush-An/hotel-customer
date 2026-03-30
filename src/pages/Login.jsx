
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState('admin');
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  // Auto-redirect if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (user && token) {
      navigate(`/${user.role}`);
    }
  }, [navigate]);


  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next box automatically
    if (value && index < 5) otpRefs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const currentOtp = otp.join('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (currentOtp.length !== 6) return setError('Enter 6-digit code');
    setLoading(true);
    setError('');
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      // Create mock user profile context based on selected tab
      const mockUser = {
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        phone: phone,
        role: role
      };
      localStorage.setItem('token', 'mock_token_123');
      localStorage.setItem('user', JSON.stringify(mockUser));
      navigate(`/${role}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-['Inter']">
      {/* Background with Sunset Pool (inspired by your photo) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1100px] flex flex-col md:flex-row items-center justify-between p-6 gap-12">
        
        {/* Left Side Content */}
        <div className="flex-1 text-white space-y-6 hidden md:block">
          <div className="flex items-center gap-4 mb-4">
             <div className="bg-yellow-500/20 p-3 rounded-2xl border border-yellow-500/30">
               <Sparkles className="text-yellow-400" size={32} />
             </div>
             <div>
                <h1 className="text-3xl font-black tracking-tight leading-none">HOTEL <br/> <span className="text-yellow-400">MANAGEMENT</span></h1>
             </div>
          </div>
          <h2 className="text-6xl font-black leading-tight drop-shadow-2xl">
            Welcome <br/> <span className="text-white/60">Back</span>
          </h2>
          <p className="text-xl text-white/70 max-w-sm font-medium">Securely manage your premium suites and guest services with ease.</p>
          <div className="w-20 h-1.5 bg-yellow-500 rounded-full"></div>
        </div>

        {/* Right Side: Frosted Glass Card */}
        <div className="w-full max-w-[380px] animate-fade-in">
          <div className="backdrop-blur-xl bg-white/10 p-6 md:p-8 rounded-[2.5rem] border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col items-center">
            
            {/* Logo from Image */}
            <div className="mb-6 text-center flex flex-col items-center">
               <div className="w-16 h-16 mb-2 flex items-center justify-center text-yellow-500">
                  {/* Lotus SVG inspired by your gold emblem */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                    <path d="M12 21.5c-1.35 0-2.61-.43-3.66-1.16l-.04-.03a11.97 11.97 0 01-3.3-4.14C3.89 13.78 3.5 11.4 3.5 9c0-2.3 1.15-4.41 3-5.6a6.76 6.76 0 013.66-1.16l.04.03-.04-.03c1.35 0 2.61.43 3.66 1.16l.04.03.04-.03A6.76 6.76 0 0117.5 3.4c1.85 1.19 3 3.3 3 5.6 0 2.4-.39 4.78-1.5 7.17-.67 1.43-1.8 2.87-3.3 4.14l-.04.03A11.97 11.97 0 0112 21.5zm.04-16.7h-.08a1.5 1.5 0 00-1.28 2.27 1.5 1.5 0 002.64 0 1.5 1.5 0 00-1.28-2.27zM6.5 9c0 4.14 2.46 7.5 5.5 7.5s5.5-3.36 5.5-7.5-2.46-7.5-5.5-7.5-5.5 3.36-5.5 7.5z"/>
                  </svg>
               </div>
               <h3 className="text-lg font-black text-white tracking-[0.2em] mb-0.5">HOTEL GLITZ SUITS</h3>
               <p className="text-[9px] text-yellow-500 font-bold tracking-[0.3em] uppercase opacity-80">Luxury Rooms & Suites</p>
            </div>

            {/* Roles Tab Selector */}
            {step === 1 && (
              <div className="w-full mb-8">
                <div className="flex bg-black/20 rounded-2xl p-1 border border-white/10 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'admin', label: 'Admin' },
                    { id: 'subadmin', label: 'Sub Admin' },
                    { id: 'receptionist', label: 'Receptionist' },
                    { id: 'roomboy', label: 'Room Boy' },
                    { id: 'housekeeping', label: 'Housekeeping' },
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`flex-1 min-w-max px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${role === r.id ? 'bg-gradient-to-r from-[#3156F3] via-[#7B33FD] to-[#ED33CD] text-white shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 ? (
              <div className="w-full space-y-6">
                 <div className="text-center">
                    <h4 className="text-2xl font-black text-white mb-2">Sign in with OTP</h4>
                    <p className="text-white/50 text-xs font-medium">Enter your mobile number to get access</p>
                 </div>

                 <div className="space-y-4">
                    <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-white/40">
                          <Phone size={18} />
                       </div>
                       <div className="absolute left-11 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-2 border-r border-white/10">
                          <span className="text-sm font-bold text-white/50">+91</span>
                       </div>
                       <input 
                         type="tel" 
                         value={phone}
                         onChange={(e) => {
                           const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                           setPhone(val);
                         }}
                         placeholder="Enter Mobile Number"
                         className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pl-24 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 transition-all text-sm font-bold"
                       />
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold py-2.5 px-4 rounded-xl flex items-center gap-2">
                        <AlertCircle size={14} /> {error}
                      </div>
                    )}

                    <button 
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="w-full h-[52px] bg-gradient-to-r from-[#3156F3] via-[#7B33FD] to-[#ED33CD] text-white font-black text-sm rounded-2xl shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : 'SEND OTP'}
                    </button>
                 </div>
              </div>
            ) : (
              <div className="w-full space-y-8 animate-slide-up">
                 <div className="text-center">
                    <h4 className="text-2xl font-black text-white mb-2">Verify OTP</h4>
                    <p className="text-white/50 text-xs font-medium">We've sent a 6-digit code to <b>{phone}</b></p>
                 </div>

                 <div className="space-y-6">
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          className="w-full h-12 bg-black/30 border border-white/10 rounded-xl text-center text-xl font-black text-white focus:outline-none focus:border-yellow-500 focus:bg-white/10 transition-all"
                        />
                      ))}
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold py-2.5 px-4 rounded-xl flex items-center gap-2">
                        <AlertCircle size={14} /> {error}
                      </div>
                    )}

                    <div className="space-y-3">
                      <button 
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="w-full h-[60px] bg-gradient-to-r from-[#3156F3] via-[#7B33FD] to-[#ED33CD] text-white font-black text-sm rounded-2xl shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center uppercase tracking-widest"
                      >
                        {loading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
                      </button>
                      <button onClick={() => setStep(1)} className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-widest">
                        <ArrowLeft size={16} /> Edit Phone Number
                      </button>
                    </div>
                 </div>
              </div>
            )}
            
            <div className="mt-8 text-center flex flex-col items-center gap-1 opacity-50">
              <span className="text-[9px] font-black text-white/60 tracking-[0.2em] uppercase">Powerby</span>
              <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase">FORGE INDIA CONNECT PVT LTD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
