import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Car, 
  UtensilsCrossed, 
  Star, 
  Home, 
  Phone, 
  Info, 
  MapPin, 
  ChevronRight,
  Menu,
  X,
  User,
  Search,
  Calendar,
  Users,
  Waves,
  Coffee,
  ShieldCheck,
  Quote,
  Send,
  Globe,
  Mail,
  Loader2,
  Bed,
  Wifi
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAvailableRooms } from '../services/api';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  useEffect(() => {
    getAvailableRooms()
      .then(rooms => setFeaturedRooms(rooms.slice(0, 3)))
      .catch(() => setFeaturedRooms([]))
      .finally(() => setRoomsLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 font-sans text-white selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2">
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-bold tracking-tighter uppercase leading-none">HOTEL GLITZ</span>
            <span className="text-[10px] tracking-[0.2em] font-light uppercase opacity-70">SUITS</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <a href="#about" className="nav-link text-xs uppercase tracking-widest">About</a>
          <a href="#rooms" className="nav-link text-xs uppercase tracking-widest">Rooms</a>
          <a href="#services" className="nav-link text-xs uppercase tracking-widest">Services</a>
          <a href="#gallery" className="nav-link text-xs uppercase tracking-widest">Gallery</a>
          <a href="#contact" className="nav-link text-xs uppercase tracking-widest">Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all hover:bg-white hover:text-black shadow-lg shadow-black/20"
          >
            <User size={14} />
            <span>Login / Join</span>
          </Link>
          <button 
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('/images/hero.png')`,
            filter: 'brightness(0.5) contrast(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-5xl duration-1000">
           <h1 className="mb-6 text-6xl font-extralight leading-tight tracking-tight md:text-8xl lg:text-9xl">
            HOTEL GLITZ <span className="font-semibold italic">SUITS</span>
          </h1>
          <p className="mb-12 text-sm font-light tracking-[0.6em] opacity-80 uppercase md:text-lg">
            Where Nature Meets Luxury
          </p>

          {/* Quick Booking Search */}
          <div className="mx-auto w-full max-w-4xl glass-dark p-2 rounded-3xl md:rounded-full mt-8 shadow-2xl border border-white/10">
             <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 text-left">
                <div className="px-6 py-3 border-b md:border-b-0 md:border-r border-white/10">
                   <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Destination</p>
                   <div className="flex items-center gap-2 font-medium">
                      <MapPin size={16} className="text-indigo-400" />
                      <span>Mountainside</span>
                   </div>
                </div>
                <div className="px-6 py-3 border-b md:border-b-0 md:border-r border-white/10">
                   <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Check-in</p>
                   <div className="flex items-center gap-2 font-medium">
                      <Calendar size={16} className="text-indigo-400" />
                      <span>Select Date</span>
                   </div>
                </div>
                <div className="px-6 py-3 border-b md:border-b-0 md:border-r border-white/10">
                   <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Guests</p>
                   <div className="flex items-center gap-2 font-medium">
                      <Users size={16} className="text-indigo-400" />
                      <span>2 Adults, 1 Child</span>
                   </div>
                </div>
                <div className="p-2">
                   <button className="w-full bg-white text-black rounded-full py-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                      <Search size={16} />
                      Search
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
           <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"></div>
           <span className="text-[8px] uppercase tracking-[0.4em] opacity-40">Explore</span>
        </div>
      </section>

      {/* Hotel Introduction (About) */}
      <section id="about" className="py-24 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         <div className="space-y-8">
            <div className="space-y-4">
               <span className="text-indigo-400 font-bold uppercase tracking-[0.4em] text-xs">Sanctum of Healing</span>
               <h2 className="text-4xl md:text-5xl font-light leading-tight">The National Rest Area <br /> <span className="font-medium italic">Surrounded by Life</span></h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light text-lg">
               HOTEL GLITZ SUITS is more than just a destination; it's a sanctuary where the elements of nature—Flowers, Wind, Forest, and Light—converge to create a world-class experience. Whether you seek winter thrills on our snowy peaks or summer serenity in our blooming gardens, we offer a haven of tranquility in all four seasons.
            </p>
            <div className="grid grid-cols-2 gap-8 py-4">
               <div>
                  <h4 className="text-3xl font-bold mb-1">200+</h4>
                  <p className="text-xs uppercase tracking-widest opacity-40">Luxury Suites</p>
               </div>
               <div>
                  <h4 className="text-3xl font-bold mb-1">12</h4>
                  <p className="text-xs uppercase tracking-widest opacity-40">Award-winning Restaurants</p>
               </div>
            </div>
            <button className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest border-b border-white/20 pb-2 hover:border-indigo-400 transition-colors">
               Discover our story <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
         <div className="relative group overflow-hidden rounded-3xl h-[600px] shadow-2xl">
            <img src="/images/hero.png" alt="High1 Panorama" className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
         </div>
      </section>

      {/* Featured Rooms — Live from HMS */}
      <section id="rooms" className="py-24 bg-slate-900/50 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full"></div>
         <div className="px-8 max-w-7xl mx-auto space-y-16 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-4">
                  <span className="text-indigo-400 font-bold uppercase tracking-[0.4em] text-xs">Exquisite Stays</span>
                  <h2 className="text-4xl font-light">Featured <span className="font-medium italic">Accommodations</span></h2>
                  {!roomsLoading && featuredRooms.length > 0 && (
                    <p className="text-slate-500 text-xs uppercase tracking-widest">{featuredRooms.length} room{featuredRooms.length!==1?'s':''} available now — live availability</p>
                  )}
               </div>
               <Link to="/dashboard" className="btn-outline px-8 rounded-full">All Rooms</Link>
            </div>

            {roomsLoading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
                <Loader2 size={28} className="animate-spin"/>
                <span className="text-sm uppercase tracking-widest">Loading available rooms...</span>
              </div>
            ) : featuredRooms.length === 0 ? (
              /* Fallback to static cards when HMS is offline */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { img: '/images/deluxe_room.png', title: 'Royal Hanok Suite', price: 450, sqft: '1,200' },
                  { img: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800', title: 'Mountain View Deluxe', price: 320, sqft: '850' },
                  { img: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800', title: 'Forest Terrace Lodge', price: 280, sqft: '720' },
                ].map((r, i) => (
                  <div key={i} className="relative group overflow-hidden rounded-3xl h-[460px] cursor-pointer shadow-2xl">
                    <img src={r.img} alt={r.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
                    <div className="absolute top-4 left-4"><span className="text-[9px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border border-white/20">Featured Suite</span></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold text-white mb-3">{r.title}</h3>
                      <div className="flex items-center justify-between">
                        <div><p className="text-[9px] font-bold uppercase tracking-widest text-white/50 mb-0.5">From</p><p className="text-indigo-400 font-black text-xl">${r.price}<span className="text-white/50 text-xs font-normal">/night</span></p></div>
                        <Link to="/login" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-all">Book Now</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Live HMS rooms */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredRooms.map((room, i) => {
                  const imgs = [
                    '/images/deluxe_room.png',
                    'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800',
                  ];
                  return (
                    <div key={room._id} className="relative group overflow-hidden rounded-3xl h-[460px] cursor-pointer shadow-2xl">
                      <img src={imgs[i % imgs.length]} alt={room.name || `Room ${room.roomNumber}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"/>
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">Available</span>
                        {room.facilities?.ac && <span className="text-[9px] font-bold bg-white/10 backdrop-blur-sm text-white px-2 py-1.5 rounded-full border border-white/20">AC</span>}
                        {room.facilities?.wifi && <span className="text-[9px] font-bold bg-white/10 backdrop-blur-sm text-white px-2 py-1.5 rounded-full border border-white/20">WiFi</span>}
                        {room.facilities?.breakfastIncluded && <span className="text-[9px] font-bold bg-white/10 backdrop-blur-sm text-white px-2 py-1.5 rounded-full border border-white/20">Breakfast</span>}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="mb-1">
                          <p className="text-[9px] uppercase tracking-widest text-white/50">Floor {room.floor} · {room.type} · {room.numberOfBeds} Bed{room.numberOfBeds>1?'s':''}</p>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Room {room.roomNumber}</h3>
                        <p className="text-xs text-white/50 mb-4">{room.name || room.type} · Max {room.maxOccupancy} guests{room.roomSize ? ` · ${room.roomSize}` : ''}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/50 mb-0.5">From</p>
                            <p className="text-indigo-400 font-black text-xl">₹{room.price}<span className="text-white/50 text-xs font-normal">/night</span></p>
                            {room.weekendPrice > 0 && <p className="text-[9px] text-white/40">Weekend ₹{room.weekendPrice}</p>}
                          </div>
                          <Link to="/dashboard" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-all">Book Now</Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
         </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-8 max-w-7xl mx-auto text-center space-y-20">
         <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-indigo-400 font-bold uppercase tracking-[0.4em] text-xs">Beyond Lodging</span>
            <h2 className="text-4xl font-light">Elevating Your <span className="font-medium italic">Experience</span></h2>
            <p className="text-slate-400 font-light">Every detail is curated to provide a world-class environment of comfort and prestige.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <ServiceItem 
               icon={<UtensilsCrossed size={32} />} 
               title="Elite Dining" 
               desc="From traditional delicacies to international fusion, crafted by Michelin chefs."
            />
            <ServiceItem 
               icon={<Waves size={32} />} 
               title="Healing Spa" 
               desc="Traditional Korean stone therapies and modern wellness treatments."
            />
            <ServiceItem 
               icon={<ShieldCheck size={32} />} 
               title="VIP Security" 
               desc="Discrete, 24/7 world-class protection and privacy for our esteemed guests."
            />
            <ServiceItem 
               icon={<Car size={32} />} 
               title="Chauffeur" 
               desc="Luxury fleet available for local tours and mountain expeditions."
            />
         </div>
      </section>

      {/* Gallery Grid */}
      <section id="gallery" className="py-24 bg-black">
         <div className="px-8 max-w-7xl mx-auto mb-12 flex justify-between items-end">
            <div className="space-y-2">
               <span className="text-indigo-400 font-bold uppercase tracking-[0.4em] text-xs">Visual Journey</span>
               <h2 className="text-4xl font-light italic">Reflections</h2>
            </div>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 h-[800px]">
             <div className="col-span-2 row-span-2 relative group overflow-hidden">
                <img src="/images/hero.png" alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="text-white font-bold uppercase tracking-widest text-xs border border-white px-4 py-2">View Experience</span>
                </div>
             </div>
             <div className="col-span-1 row-span-1 relative group overflow-hidden">
                 <img src="/images/spa.png" alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
             </div>
             <div className="col-span-1 row-span-2 relative group overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1549412650-ef35909671f4?auto=format&fit=crop&q=80&w=600" alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
             </div>
             <div className="col-span-1 row-span-1 relative group overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1540333563391-62aa161f6ca1?auto=format&fit=crop&q=80&w=600" alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
             </div>
         </div>
      </section>

      {/* Reviews (Testimonials) */}
      <section className="py-24 bg-slate-900/40 relative">
         <div className="px-8 max-w-5xl mx-auto text-center space-y-12">
            <Quote size={48} className="mx-auto text-indigo-500 opacity-20" />
            <div className="text-2xl md:text-4xl font-light leading-relaxed italic">
               "An unimaginable experience. The Hanok Suite combines ancient soul with modern luxury in a way that feels completely natural and incredibly prestigious."
            </div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700">
                  <img src="https://i.pravatar.cc/100?u=premium" alt="Reviewer" />
               </div>
               <p className="font-bold uppercase tracking-widest text-xs">Artemis Montgomery</p>
               <p className="text-[10px] text-slate-500 uppercase tracking-widest">Managing Director | Aura Global</p>
            </div>
         </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
         <div className="space-y-12">
            <div className="space-y-4">
               <span className="text-indigo-400 font-bold uppercase tracking-[0.4em] text-xs">Stay Connected</span>
               <h2 className="text-4xl font-light italic">Inquiries</h2>
            </div>
            
            <div className="space-y-8">
               <ContactInfoItem icon={<MapPin size={20} />} title="Location" value="265 High1-gil, Sabuk-eup, Jeongseon-gun, Gangwon-do" />
               <ContactInfoItem icon={<Phone size={20} />} title="Reservations" value="+82 1588 7789" />
               <ContactInfoItem icon={<Info size={20} />} title="Email" value="concierge@high1.com" />
            </div>

            <div className="flex gap-4 pt-4">
               <SocialIcon icon={<Globe size={18} />} />
               <SocialIcon icon={<Mail size={18} />} />
               <SocialIcon icon={<Globe size={18} />} />
            </div>
         </div>

         <div className="glass-dark p-10 rounded-3xl border border-white/10 space-y-8">
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-40">Your Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-40">Your Email</label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase tracking-widest opacity-40">Subject</label>
               <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase tracking-widest opacity-40">Your Message</label>
               <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"></textarea>
            </div>
            <button className="w-full bg-indigo-600 py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all">
               Send Message <Send size={14} />
            </button>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-8 max-w-7xl mx-auto text-center space-y-8">
         <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center">
               <span className="text-xl font-bold tracking-tighter uppercase leading-none">HOTEL GLITZ</span>
               <span className="text-[8px] tracking-[0.2em] font-light uppercase opacity-50">SUITS</span>
            </div>
            <nav className="flex gap-8 text-[10px] uppercase tracking-widest opacity-40">
               <a href="#" className="hover:opacity-100 italic">Privacy Policy</a>
               <a href="#" className="hover:opacity-100 italic">Terms of Service</a>
               <a href="#" className="hover:opacity-100 italic">Accessibility</a>
            </nav>
         </div>
         <p className="text-[10px] uppercase font-light tracking-[0.3em] opacity-30">© 2024 FORGE INDIA CONNECT PVT LTD. ALL RIGHTS RESERVED.</p>
      </footer>

      {/* Sticky Reservation Side (Image Match) */}
      <div className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 lg:block group">
         <button className="flex h-64 w-12 flex-col items-center justify-center gap-4 bg-indigo-900 border-r border-indigo-700/50 text-white shadow-2xl transition-all hover:w-16">
            <span className="[writing-mode:vertical-rl] text-xs font-bold tracking-[0.5em] uppercase">RESERVATION</span>
            <ChevronRight size={16} />
         </button>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-4">
          <button className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
             <MapPin size={20} />
          </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950 p-8 lg:hidden animate-in fade-in duration-300">
           <div className="flex justify-between items-center">
              <span className="text-xl font-bold tracking-tighter uppercase">HOTEL GLITZ SUITS</span>
              <button onClick={() => setIsMenuOpen(false)}><X size={32} /></button>
           </div>
           <nav className="mt-16 flex flex-col gap-8 text-3xl font-light uppercase tracking-widest text-white/90">
              <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
              <a href="#rooms" onClick={() => setIsMenuOpen(false)}>Rooms</a>
              <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
              <a href="#gallery" onClick={() => setIsMenuOpen(false)}>Gallery</a>
              <Link to="/login" className="text-indigo-400">Login</Link>
           </nav>
        </div>
      )}
    </div>
  );
};

const RoomCard = ({ image, title, price, sqft }) => (
  <div className="group relative bg-slate-900 rounded-3xl overflow-hidden border border-white/5 transition-all hover:border-white/10 hover:shadow-2xl shadow-black/40">
    <div className="relative aspect-[4/5] overflow-hidden">
       <img src={image} alt={title} className="w-full h-full object-cover grayscale-[0.3] transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0" />
       <div className="absolute top-4 left-4">
          <span className="bg-black/60 backdrop-blur-md text-[8px] font-bold uppercase tracking-widest text-white px-3 py-1.5 rounded-full border border-white/10 italic">Featured Suite</span>
       </div>
    </div>
    <div className="p-8 space-y-4">
       <div className="flex justify-between items-start">
          <h4 className="text-xl font-bold leading-tight">{title}</h4>
          <div className="text-right">
             <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">From</p>
             <p className="text-lg font-bold text-indigo-400">${price}<span className="text-[10px] text-white opacity-40">/night</span></p>
          </div>
       </div>
       <div className="flex gap-6 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs font-light tracking-wide italic opacity-60">
             <Home size={12} className="text-indigo-400" /> {sqft} sq ft
          </div>
          <div className="flex items-center gap-2 text-xs font-light tracking-wide italic opacity-60">
             <Building2 size={12} className="text-indigo-400" /> City/Mt View
          </div>
       </div>
    </div>
  </div>
);

const ServiceItem = ({ icon, title, desc }) => (
  <div className="group space-y-6 text-center p-8 rounded-3xl transition-all hover:bg-slate-900/60 border border-transparent hover:border-white/5">
    <div className="w-16 h-16 mx-auto bg-slate-800 flex items-center justify-center rounded-2xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-12">
      {icon}
    </div>
    <div className="space-y-2">
      <h4 className="text-lg font-bold tracking-wide uppercase italic">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed font-light">{desc}</p>
    </div>
  </div>
);

const ContactInfoItem = ({ icon, title, value }) => (
   <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 shrink-0">
         {icon}
      </div>
      <div>
         <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">{title}</p>
         <p className="text-base font-light text-slate-300">{value}</p>
      </div>
   </div>
);

const SocialIcon = ({ icon }) => (
   <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
      {icon}
   </a>
);

export default LandingPage;
