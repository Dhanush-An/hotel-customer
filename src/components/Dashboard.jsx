import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, 
  Calendar, 
  Gift, 
  History, 
  Home, 
  LogOut, 
  Settings, 
  Star, 
  User, 
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  MapPin,
  CreditCard,
  Mail,
  HelpCircle,
  Building,
  Menu,
  X,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Wifi,
  WifiOff,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAvailableRooms, getBookings, createBooking } from '../services/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [liveRooms, setLiveRooms] = useState([]);
  const [liveBookings, setLiveBookings] = useState([]);
  const [apiOnline, setApiOnline] = useState(null); // null=checking, true=online, false=offline
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [bookingModal, setBookingModal] = useState(null); // room object
  const [bookingForm, setBookingForm] = useState({ 
    name:'', phone:'', checkin:'', checkout:'', adults:1, children:0, 
    bookingType: 'DAY BASIS', source: 'Direct', address: '', idProof: '', 
    transport: 'Public', vehicleNumber: '' 
  });
  const [bookingStatus, setBookingStatus] = useState(null); // 'loading'|'success'|'error'

  const fetchLiveData = useCallback(async () => {
    setLoadingRooms(true);
    try {
      const [rooms, bookings] = await Promise.all([getAvailableRooms(), getBookings()]);
      setLiveRooms(rooms);
      setLiveBookings(bookings);
      setApiOnline(true);
    } catch {
      setApiOnline(false);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  useEffect(() => { fetchLiveData(); }, [fetchLiveData]);

  const handleBookSubmit = async () => {
    if (!bookingForm.name || !bookingForm.checkin || !bookingForm.checkout) return;
    setBookingStatus('loading');
    try {
      const nights = Math.max(1, Math.ceil((new Date(bookingForm.checkout) - new Date(bookingForm.checkin)) / 86400000));
      await createBooking({
        id: 'CUST-' + Date.now(),
        guest: bookingForm.name,
        phone: bookingForm.phone,
        address: bookingForm.address,
        idProof: bookingForm.idProof,
        room: bookingModal.roomNumber,
        type: bookingModal.type,
        checkin: bookingForm.checkin,
        checkout: bookingForm.checkout,
        nights,
        amount: (bookingModal.price || 0) * nights,
        status: 'Pending', // Requires HMS approval
        payment: 'Pending',
        source: 'Online', // Explicitly marked as Online for HMS filtering
        bookingType: bookingForm.bookingType,
        transport: bookingForm.transport,
        vehicleNumber: bookingForm.transport === 'Private' ? bookingForm.vehicleNumber : '',
        adults: bookingForm.adults,
        children: bookingForm.children,
      });
      setBookingStatus('success');
      setTimeout(() => { 
        setBookingModal(null); 
        setBookingStatus(null); 
        setBookingForm({ 
          name:'', phone:'', checkin:'', checkout:'', adults:1, children:0, 
          bookingType: 'DAY BASIS', source: 'Direct', address: '', 
          idProof: '', transport: 'Public', vehicleNumber: '' 
        }); 
        fetchLiveData(); 
      }, 1800);
    } catch {
      setBookingStatus('error');
      setTimeout(() => setBookingStatus(null), 2000);
    }
  };

  const tabs = [
    { id: 'Overview', icon: <Home size={20} /> },
    { id: 'Available Rooms', icon: <Building size={20} /> },
    { id: 'My Bookings', icon: <Calendar size={20} /> },
    { id: 'Payment History', icon: <CreditCard size={20} /> },
    { id: 'Profile', icon: <User size={20} /> },
    { id: 'Notifications', icon: <Bell size={20} /> },
    { id: 'Support', icon: <HelpCircle size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#F0F2F5] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 hidden md:flex`}>
        <div className="p-8 flex justify-between items-center overflow-hidden">
           {isSidebarOpen && (
              <Link to="/" className="text-xl font-bold tracking-tighter uppercase leading-none text-indigo-900 block truncate">HOTEL GLITZ SUITS</Link>
           )}
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          {tabs.map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                   activeTab === tab.id ? 'bg-indigo-50 text-indigo-900' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                }`}
             >
                <div className={`${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400'} transition-colors`}>
                   {tab.icon}
                </div>
                {isSidebarOpen && <span className="truncate">{tab.id}</span>}
             </button>
          ))}
        </nav>

        {isSidebarOpen && (
           <div className="p-6">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-4 text-white shadow-lg overflow-hidden relative">
                 <p className="text-[9px] font-medium opacity-60 mb-2 uppercase tracking-widest">LOYALTY STATUS</p>
                 <h4 className="text-sm font-bold mb-3">Diamond Tier</h4>
                 <div className="w-full h-1 bg-white/20 rounded-full mb-2">
                    <div className="w-4/5 h-full bg-indigo-400"></div>
                 </div>
                 <div className="flex justify-between text-[8px] opacity-60 font-bold uppercase tracking-widest">
                    <span>Active</span>
                    <span>9,240 / 12k pts</span>
                 </div>
                 {/* Decorative background circle */}
                 <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
              </div>
           </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative flex flex-col">
        {/* Navigation Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800 hidden sm:block">{activeTab}</h2>
              <div className="relative w-64 max-w-full hidden lg:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   className="w-full bg-slate-100 border-none rounded-full py-1.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                 />
              </div>
           </div>

           <div className="flex items-center gap-6">
              <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-800">James Wilson</p>
                    <p className="text-[9px] text-slate-400 font-medium tracking-widest uppercase">Premium Customer</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                    <img src="https://i.pravatar.cc/100?u=james" alt="Profile" />
                 </div>
              </div>
           </div>
        </header>

        {/* API Status Banner */}
        {apiOnline === false && (
          <div className="mx-6 mt-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <WifiOff size={16} className="text-amber-500 shrink-0"/>
            <p className="text-xs text-amber-700 font-semibold italic uppercase tracking-widest leading-relaxed">
              {window.location.hostname === 'localhost' ? (
                <>Cannot reach Customer API. Start the backend server for HMS synchronization.</>
              ) : (
                <>Establishing secure connection to HMS services... (Showing Limited Offline Data)</>
              )}
            </p>
            <button onClick={fetchLiveData} className="ml-auto p-1.5 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors"><RefreshCw size={14} className="animate-spin-slow" /></button>
          </div>
        )}
        {apiOnline === true && (
          <div className="mx-6 mt-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            <Wifi size={16} className="text-emerald-500 shrink-0"/>
            <p className="text-xs text-emerald-700 font-semibold">Live data connected to HMS — rooms and bookings sync in real time.</p>
            <button onClick={fetchLiveData} className="ml-auto text-emerald-600 hover:text-emerald-800"><RefreshCw size={14}/></button>
          </div>
        )}

        {/* Content Wrapper */}
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8 duration-500">
           {renderModule(activeTab, { liveRooms, liveBookings, loadingRooms, setBookingModal })}
        </div>
      </main>

    {/* New Guest Registration Modal */}
    {bookingModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-bold text-slate-800">New Guest Registration</h3>
            <button onClick={() => { setBookingModal(null); setBookingStatus(null); }} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
              <X size={20}/>
            </button>
          </div>

          <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
            {bookingStatus === 'success' ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={40} className="text-emerald-500"/>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Registration Complete!</h3>
                <p className="text-slate-400 max-w-xs mx-auto">The guest details have been synchronized with the HMS. Redirecting...</p>
              </div>
            ) : (
              <>
                {/* Booking Type Toggle */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Booking Type</label>
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                    {['DAY BASIS', 'HOUR BASIS'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setBookingForm({...bookingForm, bookingType: type})}
                        className={`px-6 py-2 text-[10px] font-bold transition-all rounded-lg ${bookingForm.bookingType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Row 1 */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Guest Full Name</label>
                    <input type="text" placeholder="Guest Full Name" value={bookingForm.name}
                      onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone Number</label>
                    <input type="text" placeholder="Phone Number" value={bookingForm.phone}
                      onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"/>
                  </div>

                  {/* Row 2 */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Room Type</label>
                    <select value={bookingModal.type} disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none appearance-none">
                      <option>{bookingModal.type}</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Room</label>
                    <select value={bookingModal.roomNumber} disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none appearance-none">
                      <option>{bookingModal.roomNumber} — {bookingModal.name || bookingModal.type}</option>
                    </select>
                  </div>

                  {/* New Row: Address & ID Proof */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Address</label>
                    <textarea placeholder="Enter Guest Full Address" rows="1" value={bookingForm.address}
                      onChange={e => setBookingForm({...bookingForm, address: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ID Proof (Aadhaar / Voter ID)</label>
                    <input type="text" placeholder="ID Number..." value={bookingForm.idProof}
                      onChange={e => setBookingForm({...bookingForm, idProof: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Type of Transport</label>
                    <select value={bookingForm.transport || 'Public'} 
                      onChange={e => setBookingForm({...bookingForm, transport: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                      <option value="Public">Public Transport</option>
                      <option value="Private">Private Transport</option>
                    </select>
                  </div>

                  {/* Conditional: Vehicle Number */}
                  {bookingForm.transport === 'Private' && (
                    <div className="space-y-1.5 md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vehicle Number</label>
                      <input type="text" placeholder="e.g. MH 12 AB 1234" value={bookingForm.vehicleNumber}
                        onChange={e => setBookingForm({...bookingForm, vehicleNumber: e.target.value})}
                        className="w-full bg-slate-50 border border-indigo-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"/>
                    </div>
                  )}

                  {/* Row 3 */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Booking Source</label>
                    <select value={bookingForm.source || 'Direct'} 
                      onChange={e => setBookingForm({...bookingForm, source: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                      <option>Direct</option>
                      <option>OTA (Booking.com/Agoda)</option>
                      <option>Corporate</option>
                      <option>Website</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Check-in Date</label>
                    <input type="date" value={bookingForm.checkin}
                      onChange={e => setBookingForm({...bookingForm, checkin: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm shadow-inner"/>
                  </div>

                  {/* Row 4 */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Check-out Date</label>
                    <input type="date" value={bookingForm.checkout}
                      onChange={e => setBookingForm({...bookingForm, checkout: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm shadow-inner"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Adults</label>
                      <input type="number" min={1} value={bookingForm.adults}
                        onChange={e => setBookingForm({...bookingForm, adults: Number(e.target.value)})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"/>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Children</label>
                      <input type="number" min={0} value={bookingForm.children || 0}
                        onChange={e => setBookingForm({...bookingForm, children: Number(e.target.value)})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"/>
                    </div>
                  </div>
                </div>

                {bookingForm.checkin && bookingForm.checkout && (
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Estimated Total Amount</p>
                      <p className="text-xl font-black text-indigo-900">₹{bookingModal.price * Math.max(1, Math.ceil((new Date(bookingForm.checkout)-new Date(bookingForm.checkin))/86400000))}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">
                        {Math.max(1,Math.ceil((new Date(bookingForm.checkout)-new Date(bookingForm.checkin))/86400000))} Night(s)
                      </span>
                    </div>
                  </div>
                )}

                {bookingStatus === 'error' && <p className="text-red-500 text-xs font-bold text-center italic">Failed to register guest. Please check your connection.</p>}

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setBookingModal(null)} className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors">Cancel</button>
                  <button onClick={handleBookSubmit} disabled={bookingStatus==='loading'}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {bookingStatus==='loading' ? <><Loader2 size={16} className="animate-spin"/>Registering...</> : 'Confirm Booking'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

// Module Rendering Logic
const renderModule = (tab, props = {}) => {
  switch (tab) {
    case 'Overview': return <OverviewModule liveRooms={props.liveRooms} setBookingModal={props.setBookingModal} />;
    case 'Available Rooms': return <AvailableRoomsModule liveRooms={props.liveRooms} loadingRooms={props.loadingRooms} setBookingModal={props.setBookingModal} />;
    case 'My Bookings': return <BookingsModule liveBookings={props.liveBookings} />;
    case 'Payment History': return <PaymentsModule />;
    case 'Profile': return <ProfileModule />;
    case 'Notifications': return <NotificationsModule />;
    case 'Support': return <SupportModule />;
    default: return <OverviewModule />;
  }
};

// --- Module Components ---

const OverviewModule = ({ liveRooms, setBookingModal }) => (
   <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatsCard icon={<Calendar className="text-blue-500" />} title="Upcoming Trips" value="02" subtitle="Next: Mountain View Suite" />
         <StatsCard icon={<Building className="text-emerald-500" />} title="Available Suites" value={liveRooms?.length || '0'} subtitle="Ready for booking" />
         <StatsCard icon={<Star className="text-orange-400" />} title="Loyalty Points" value="12,450" subtitle="Tier: Diamond" />
      </div>

      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl font-bold mb-4 italic leading-tight">Your Winter Getaway <br /> Starts Soon</h2>
            <p className="text-indigo-100/60 mb-6 font-light">Prepare for your stay in the Presidential Hanok Suite. Your private chef has been notified of your preferences.</p>
            <button className="bg-white text-indigo-900 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl">
               Manage Booking
            </button>
         </div>
         <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-40">
            <img src="/images/hero.png" alt="Resort" className="h-full w-full object-cover" />
         </div>
      </div>

      {liveRooms && liveRooms.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-widest text-[10px]">Recommended For You</h4>
            <p className="text-[10px] text-indigo-600 font-bold">LIVE AVAILABILITY</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liveRooms.slice(0, 3).map((room, i) => (
              <div key={room._id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 group hover:border-indigo-200 transition-all cursor-pointer"
                onClick={() => setBookingModal(room)}>
                <div className="w-full h-24 rounded-xl bg-slate-50 overflow-hidden relative">
                   <img src={[
                     "/images/deluxe_room.png",
                     "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=400",
                     "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=400"
                   ][i % 3]} alt="Room" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                   <div className="absolute top-2 left-2"><span className="bg-white/90 backdrop-blur-sm text-[8px] font-black px-2 py-1 rounded-lg">ROOM {room.roomNumber}</span></div>
                </div>
                <div>
                   <h5 className="font-bold text-sm text-slate-800">{room.name || room.type}</h5>
                   <p className="text-[10px] text-slate-400">₹{room.price}/night</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
   </div>
);

const AvailableRoomsModule = ({ liveRooms, loadingRooms, setBookingModal }) => (
   <div className="space-y-8">
      <div className="flex justify-between items-end">
         <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-800">Rooms & Suites</h3>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-medium italic">Discover your next stay</p>
         </div>
         <div className="flex gap-4">
            <select className="bg-white border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-indigo-500/20">
               <option>All Types</option>
               <option>Luxury Suites</option>
               <option>Deluxe Rooms</option>
            </select>
         </div>
      </div>

      {loadingRooms ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
          <Loader2 size={40} className="animate-spin text-indigo-500" />
          <p className="text-sm font-medium animate-pulse">Syncing with HMS Availability...</p>
        </div>
      ) : liveRooms.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
          <Building className="mx-auto text-slate-200 mb-4" size={48} />
          <h4 className="text-lg font-bold text-slate-800">No Available Rooms</h4>
          <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2">All our prestigious suites are currently occupied. Please check back later or contact concierge.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {liveRooms.map((room, i) => {
              const imgs = [
                "/images/deluxe_room.png",
                "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=600",
                "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=600",
                "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"
              ];
              return (
                <div key={room._id || room.roomNumber} className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-6 border border-slate-200 hover:shadow-xl hover:border-indigo-100 transition-all group relative overflow-hidden">
                   <div className="w-full sm:w-48 h-40 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      <img 
                        src={imgs[i % imgs.length]} 
                        alt={room.type} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
                      />
                      <div className="absolute top-6 left-6">
                        <span className="bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/20">Available</span>
                      </div>
                   </div>
                   <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                         <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-900 transition-colors uppercase tracking-tight">
                               Room {room.roomNumber} — {room.name || room.type}
                            </h4>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{room.type}</span>
                         </div>
                         <p className="text-[11px] text-slate-400 italic mt-1">
                           {room.roomSize || '850 sq ft'} • {room.floor === '0' ? 'Ground' : `Floor ${room.floor}`} • {room.numberOfBeds} {room.numberOfBeds > 1 ? 'Beds' : 'Bed'}
                         </p>
                         <div className="flex gap-3 mt-3">
                            {room.facilities?.wifi && <Wifi size={14} className="text-slate-300" />}
                            {room.facilities?.ac && <Building size={14} className="text-slate-300" />}
                            <Star size={14} className="text-orange-300" />
                         </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-4">
                         <div>
                            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Standard Rate</p>
                            <p className="text-xl font-black text-slate-900">₹{room.price}<span className="text-[10px] text-slate-400 font-medium">/night</span></p>
                         </div>
                         <button 
                           onClick={() => setBookingModal(room)}
                           className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 shadow-lg shadow-slate-900/10 transition-all active:scale-95"
                         >
                           Book Now
                         </button>
                      </div>
                   </div>
                </div>
              );
           })}
        </div>
      )}
   </div>
);

const BookingsModule = ({ liveBookings }) => (
   <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
         <button className="text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-4 -mb-4">Upcoming Stays</button>
         <button className="text-sm font-medium text-slate-400 hover:text-indigo-600 pb-4 -mb-4 transition-colors">Past Experiences</button>
      </div>

      <div className="space-y-4">
         {!liveBookings || liveBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
               <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
               <h4 className="text-lg font-bold text-slate-800">No Bookings Found</h4>
               <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2">You haven't made any reservations yet. Explore our luxury suites to start your journey.</p>
               <button className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 transition-all">Explore Rooms</button>
            </div>
         ) : (
            liveBookings.map((booking, i) => (
               <div key={booking._id || booking.id} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                  <div className="absolute top-0 right-0 p-6">
                     <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                        booking.status === 'Confirmed' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 
                        booking.status === 'Cancelled' ? 'border-red-100 bg-red-50 text-red-600' : 'border-blue-100 bg-blue-50 text-blue-600'
                     }`}>
                        {booking.status || 'unknown'}
                     </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     <div className="col-span-1 space-y-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Resort Location</p>
                        <div className="flex items-start gap-2">
                           <MapPin size={16} className="text-indigo-500 shrink-0 mt-1" />
                           <h4 className="font-bold text-slate-800 leading-tight">HOTEL GLITZ SUITS</h4>
                        </div>
                     </div>
                     <div className="col-span-1 space-y-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Dates of Stay</p>
                        <div className="flex items-start gap-2">
                           <Calendar size={16} className="text-indigo-500 shrink-0 mt-1" />
                           <h4 className="font-bold text-slate-800">{new Date(booking.checkin).toLocaleDateString()} - {new Date(booking.checkout).toLocaleDateString()}</h4>
                        </div>
                     </div>
                     <div className="col-span-1 space-y-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Guests & Suite</p>
                        <div className="flex items-start gap-2">
                           <User size={16} className="text-indigo-500 shrink-0 mt-1" />
                           <h4 className="font-bold text-slate-800 italic">{booking.adults || 1} Guest(s) • Room {booking.room}</h4>
                        </div>
                     </div>
                     <div className="col-span-1 flex items-center justify-end gap-3">
                        <button className="p-3 border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 transition-colors"><X size={18} /></button>
                        <button className="px-6 py-3 bg-indigo-50 text-indigo-900 border border-indigo-100 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2">Details <ArrowUpRight size={14} /></button>
                     </div>
                  </div>
               </div>
            ))
         )}
      </div>
   </div>
);

const PaymentsModule = () => (
   <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
         <h3 className="font-bold text-slate-800">Transaction History</h3>
         <button className="flex items-center gap-2 text-xs font-bold text-indigo-600"><History size={16} /> Export Statement</button>
      </div>
      <table className="w-full text-left">
         <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold">
            <tr>
               <th className="px-8 py-4">Transaction ID</th>
               <th className="px-8 py-4">Service</th>
               <th className="px-8 py-4">Total Amount</th>
               <th className="px-8 py-4">Status</th>
               <th className="px-8 py-4">Date</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map(i => (
               <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 text-sm font-medium text-slate-800 font-mono tracking-tighter">#TXN-82934-00{i}</td>
                  <td className="px-8 py-5 text-sm italic text-slate-600">Royal Suite Reservation</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-800">$1,240.00</td>
                  <td className="px-8 py-5">
                     <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${i % 3 === 0 ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {i % 3 === 0 ? 'pending' : 'completed'}
                     </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-400">Oct 12, 2024</td>
               </tr>
            ))}
         </tbody>
      </table>
   </div>
);

const ProfileModule = () => (
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
         <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-6 shadow-sm">
            <div className="relative inline-block">
               <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-200 mx-auto">
                  <img src="https://i.pravatar.cc/200?u=james" alt="Avatar" />
               </div>
               <button className="absolute bottom-1 right-1 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                  <ArrowDownLeft size={16} />
               </button>
            </div>
            <div className="space-y-1">
               <h3 className="text-2xl font-bold text-slate-800">James Wilson</h3>
               <p className="text-xs text-slate-400 font-medium italic">Premium Member since 2021</p>
            </div>
            <div className="flex gap-2 justify-center">
               <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-bold tracking-widest text-slate-400 uppercase">NYC, USA</span>
               <span className="px-3 py-1 bg-indigo-50 rounded-full text-[9px] font-bold tracking-widest text-indigo-500 uppercase">Verified</span>
            </div>
         </div>
         
         <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6 shadow-sm">
            <h4 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Security Settings</h4>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="text-emerald-500" size={18} />
                     <span className="text-sm font-medium">Two-Factor Auth</span>
                  </div>
                  <div className="w-10 h-5 bg-indigo-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div></div>
               </div>
               <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                     <Clock className="text-indigo-400" size={18} />
                     <span className="text-sm font-medium">Auto Sign-out</span>
                  </div>
                  <div className="w-10 h-5 bg-slate-200 rounded-full"></div>
               </div>
            </div>
         </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-10 space-y-10">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800">Personal Information</h3>
            <button className="bg-slate-900 text-white px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all">Save Changes</button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Full Name</label>
               <input type="text" defaultValue="James Wilson" className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Mobile Number</label>
               <input type="text" defaultValue="+1 (555) 001 2293" className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Email Address</label>
               <input type="email" defaultValue="james.wilson@premium.com" className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Date of Birth</label>
               <input type="date" defaultValue="1988-10-24" className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="md:col-span-2 space-y-2">
               <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Special Preferences / Requests</label>
               <textarea rows="4" className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20">Allergic to tree nuts. Prefers upper floor suites with sunrise view. Quiet environment requested.</textarea>
            </div>
         </div>
      </div>
   </div>
);

const NotificationsModule = () => (
   <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-8">
         <h3 className="text-2xl font-bold text-slate-800">Alert Center</h3>
         <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Mark All as Read</button>
      </div>

      {[
         { type: 'Update', icon: <Star className="text-blue-500" />, title: 'Loyalty Tier Boost', time: '2 hours ago', text: 'Congratulations! You have reached Diamond Tier status. Check your rewards for new exclusive offers.' },
         { type: 'Booking', icon: <Calendar className="text-emerald-500" />, title: 'Booking Confirmed', time: '1 day ago', text: 'We have received confirmation for your Mountain View Suite reservation. Check-in details sent to your email.' },
         { type: 'Security', icon: <ShieldCheck className="text-orange-500" />, title: 'Login Detected', time: 'Yesterday', text: 'A new login was detected from a Chrome browser on Windows 11. Was this you?' },
         { type: 'System', icon: <AlertCircle className="text-slate-400" />, title: 'System Maintenance', time: '3 days ago', text: 'Access to the payment module will be temporarily limited on Sunday for scheduled upgrades.' },
      ].map((n, i) => (
         <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex gap-6 group hover:border-indigo-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
               {n.icon}
            </div>
            <div className="flex-1 space-y-1">
               <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800">{n.title}</h4>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{n.time}</span>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed font-light">{n.text}</p>
            </div>
         </div>
      ))}
   </div>
);

const SupportModule = () => (
   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-3xl border border-slate-200 p-10 space-y-8 shadow-sm">
         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <HelpCircle size={32} />
         </div>
         <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-800">Support Inquiry</h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed">Our concierge team is available 24/7 to assist with your stay, dining reservations, or travel logistics.</p>
         </div>
         <form className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Topic</label>
               <select className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium outline-none">
                  <option>Booking Modification</option>
                  <option>Payment Issue</option>
                  <option>Resort Services</option>
                  <option>Feedback & Suggestions</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Describe Your Issue</label>
               <textarea rows="4" className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 text-sm font-medium outline-none" placeholder="How can we help you?"></textarea>
            </div>
            <button className="w-full bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
               Launch Live Chat <ArrowUpRight size={14} />
            </button>
         </form>
      </div>

      <div className="space-y-6">
         <h4 className="font-bold text-slate-800 uppercase tracking-[0.2em] text-xs">Frequently Asked Questions</h4>
         <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
               <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-bold text-slate-700 italic">{i === 1 ? 'How do I upgrade my room tier?' : 'Policy on late check-outs?'}</span>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />
               </div>
            ))}
         </div>

         <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl mt-12">
             <div className="relative z-10">
                <h4 className="text-lg font-bold mb-2">Direct Concierge</h4>
                <p className="text-xs opacity-60 mb-6 font-light">Prefer to speak directly? Our VIP handles are ready for you.</p>
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Phone size={18} /></div>
                      <span className="text-sm font-bold">+82 1588 7789</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><Mail size={18} /></div>
                      <span className="text-sm font-bold italic underline opacity-80">vip@high1.com</span>
                   </div>
                </div>
             </div>
             <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
         </div>
      </div>
   </div>
);

// --- Subcomponents ---

const StatsCard = ({ icon, title, value, subtitle }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
    <div className="space-y-1 relative z-10">
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          {title} 
       </p>
       <div className="flex items-end justify-between">
          <h4 className="text-3xl font-black text-indigo-900">{value}</h4>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors group-hover:text-white duration-500">
             {icon}
          </div>
       </div>
       <p className="text-[10px] text-slate-400 font-medium italic pt-2">{subtitle}</p>
    </div>
  </div>
);

export default Dashboard;
