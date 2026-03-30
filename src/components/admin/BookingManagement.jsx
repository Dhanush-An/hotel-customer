import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, ChevronDown, X, Calendar, CalendarCheck, User, BedDouble, Clock, Hash, CreditCard, DollarSign } from 'lucide-react';

const BOOKINGS = [];

const STATUS_BADGE = {
  'Checked In': 'bg-green-100 text-green-700',
  'Checked Out': 'bg-gray-100 dark:bg-[#2a2a35] text-gray-600 dark:text-[#a1a1aa]',
  Reserved: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-600',
  Pending: 'bg-orange-100 text-orange-600 animate-pulse',
};

const PAY_BADGE = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Partial: 'bg-orange-100 text-orange-600',
  Refunded: 'bg-purple-100 text-purple-700',
};

const ViewBookingModal = ({ booking, onClose }) => {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1c1c24] w-full max-w-2xl rounded-[32px] shadow-premium overflow-hidden border border-border dark:border-[#2a2a35] animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-border dark:border-[#2a2a35] flex items-center justify-between bg-gray-50/50 dark:bg-[#13131a]/50">
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Booking Details</h3>
            <p className="text-xs text-secondary-500 font-bold uppercase tracking-widest mt-0.5">{booking.id}</p>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-2xl hover:bg-red-50 hover:text-red-500 text-gray-400 dark:text-[#a1a1aa] transition-all"><X size={20} /></button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-2 gap-y-8 gap-x-12">
            {[
              { label: 'Guest Full Name', value: booking.guest, icon: <User size={16} /> },
              { label: 'Phone Number', value: booking.phone || '—', icon: <Hash size={16} /> },
              { label: 'Room', value: booking.room, icon: <BedDouble size={16} /> },
              { label: 'Booking Source', value: booking.source, icon: <Calendar size={16} /> },
              { label: 'Check-In Date', value: booking.checkin, icon: <Clock size={16} /> },
              { label: 'Check-Out Date', value: booking.checkout, icon: <Clock size={16} /> },
              { label: 'No. of Adults', value: booking.adults || 1 },
              { label: 'No. of Children', value: booking.children || 0 },
              { label: 'Payment Method', value: booking.method, icon: <CreditCard size={16} /> },
              { label: 'Payment Status', value: booking.payment, customClass: PAY_BADGE[booking.payment] },
              { label: 'Residential Address', value: booking.address || '—', span: 2 },
              { label: 'ID Proof Type', value: booking.idType || '—' },
              { label: 'ID Proof Number', value: booking.idNum || '—' },
              { label: 'Visiting Purpose', value: booking.purpose || '—' },
              { label: 'Transportation', value: booking.transport || '—' },
              { label: 'Total Amount', value: `₹${booking.amount.toLocaleString()}`, icon: <DollarSign size={16} /> },
              ...(booking.transport === 'Vehicle' ? [{ label: 'Vehicle Reg. Number', value: booking.vehicleReg || '—' }] : []),
            ].map((item, i) => (
              <div key={i} className={item.span ? `col-span-${item.span}` : ''}>
                <label className="text-[10px] font-black text-gray-400 dark:text-[#a1a1aa] uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  {item.icon} {item.label}
                </label>
                {item.customClass ? (
                   <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${item.customClass}`}>{item.value}</span>
                ) : (
                   <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 py-6 bg-gray-50/50 dark:bg-[#13131a]/50 border-t border-border dark:border-[#2a2a35] flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-gray-900 border-4 border-white dark:border-[#2a2a35] text-white rounded-2xl font-black text-xs hover:bg-black transition-all shadow-xl active:scale-95">CLOSE PORTAL</button>
        </div>
      </div>
    </div>
  );
};


const AddBookingModal = ({ onClose, onSaved }) => {
  const [rooms, setRooms] = useState([]);
  
  useEffect(() => {
    api.getRooms().then(setRooms).catch(console.error);
  }, []);
  
  const [form, setForm] = useState({
    guest: '', phone: '', room: '', roomType: 'Deluxe', source: 'Direct',
    bookingBasis: 'Day', // New field
    checkin: new Date().toISOString().split('T')[0], 
    checkout: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    durationHours: 1, // For hour basis
    adults: 1, children: 0,
    paymentMethod: 'Cash', paymentStatus: 'Paid', requests: '',
    address: '', idProofType: 'Aadhar', idProofNumber: '',
    visitingPurpose: 'Personal', transportType: 'Public Transport', vehicleRegNumber: ''
  });

  // Unique Room Types available
  const availableTypes = [...new Set(rooms.map(r => r.type))];
  
  // Filtered rooms based on selected type
  const filteredRooms = rooms.filter(r => r.type === form.roomType && r.status === 'Available');

  // Initialize first room if empty
  useEffect(() => {
    if (filteredRooms.length > 0 && !form.room) {
      setForm(prev => ({ ...prev, room: `${filteredRooms[0].roomNumber} - ${filteredRooms[0].type}` }));
    }
  }, [filteredRooms, form.room]);

  const handleChange = (field, value) => {
    if (field === 'roomType') {
       setForm(p => ({ ...p, [field]: value, room: '' }));
    } else {
       setForm(p => ({ ...p, [field]: value }));
    }
  };

  const handleSave = () => {
    if (!form.guest || !form.room) {
      alert("Please fill in Guest Name and Select a Room");
      return;
    }
    if (!form.address.trim()) {
      alert("Residential Address is mandatory");
      return;
    }
    if (!form.idProofNumber.trim()) {
      alert("ID Proof Number (Aadhar/Passport etc.) is mandatory");
      return;
    }
    
    // Find the selected room to get its specific price
    const selectedRoomNumber = form.room.split(' - ')[0];
    const roomDetails = rooms.find(r => String(r.roomNumber) === String(selectedRoomNumber));
    const dayPrice = Number(roomDetails?.price) || 2500;
    
    let totalAmount = 0;
    let nights = 0;
    let checkoutVal = form.checkout;

    if (form.bookingBasis === 'Day') {
        const d1 = new Date(form.checkin);
        const d2 = new Date(form.checkout);
        nights = Math.max(1, Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24)) || 1);
        totalAmount = dayPrice * nights;
    } else {
        // Hourly logic: 1/12th of day price per hour (example rate)
        const hourPrice = Math.round(dayPrice / 8); 
        const hours = Number(form.durationHours) || 1;
        totalAmount = hourPrice * hours;
        nights = hours / 24; // Represent as fraction of day
        checkoutVal = `${form.checkin} (${hours} Hours)`;
    }

    onSaved({
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      guest: form.guest,
      room: form.room,
      type: form.room.split(' - ')[1] || form.roomType,
      checkin: form.checkin,
      checkout: checkoutVal,
      nights: nights,
      amount: totalAmount,
      status: 'Confirmed',
      payment: form.paymentStatus,
      method: form.paymentMethod,
      source: form.source,
      address: form.address,
      idType: form.idProofType,
      idNum: form.idProofNumber,
      purpose: form.visitingPurpose,
      transport: form.transportType,
      vehicleReg: form.vehicleRegNumber,
      phone: form.phone,
      adults: form.adults,
      children: form.children,
      bookingBasis: form.bookingBasis // Extra metadata
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1c1c24] w-full max-w-xl rounded-2xl shadow-premium overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border dark:border-[#2a2a35]">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">New Guest Registration</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#2a2a35] dark:bg-[#2a2a35] text-gray-500 dark:text-[#a1a1aa]"><X size={20} /></button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
               <label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-2 block">Booking Type</label>
               <div className="flex bg-gray-100 dark:bg-[#13131A] p-1 rounded-xl w-fit">
                  {['Day', 'Hour'].map(b => (
                    <button key={b} onClick={() => handleChange('bookingBasis', b)} 
                      className={`px-6 py-2 text-xs font-bold uppercase rounded-lg transition-all ${form.bookingBasis === b ? 'bg-white dark:bg-[#2a2a35] shadow-sm text-primary-500' : 'text-gray-400'}`}>
                      {b} Basis
                    </button>
                  ))}
               </div>
            </div>

            <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Guest Full Name</label>
            <input value={form.guest} onChange={e=>handleChange('guest', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" placeholder="Guest Full Name" /></div>

            <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Phone Number</label>
            <input value={form.phone} onChange={e=>handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" placeholder="Phone Number" /></div>

            <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Select Room Type</label>
            <select value={form.roomType} onChange={e=>handleChange('roomType', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
              {availableTypes.length > 0 ? availableTypes.map(t => <option key={t} value={t}>{t}</option>) : <option>No Types Available</option>}
            </select></div>

            <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Select Room</label>
            <select value={form.room} onChange={e=>handleChange('room', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
              <option value="">{filteredRooms.length > 0 ? '-- Select Room --' : 'No Rooms Available'}</option>
              {filteredRooms.map(r => <option key={r.roomNumber} value={`${r.roomNumber} - ${r.type}`}>{r.roomNumber} - {r.name || r.type}</option>)}
            </select></div>

            <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Booking Source</label>
            <select value={form.source} onChange={e=>handleChange('source', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
              <option>Direct</option><option>Booking.com</option><option>OYO</option><option>MakeMyTrip</option>
            </select></div>

            <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Check-In Date</label>
            <input type="date" value={form.checkin} onChange={e=>handleChange('checkin', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" /></div>

            {form.bookingBasis === 'Day' ? (
                <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Check-Out Date</label>
                <input type="date" value={form.checkout} onChange={e=>handleChange('checkout', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" /></div>
            ) : (
                <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Duration (Hours)</label>
                <input type="number" min="1" max="23" value={form.durationHours} onChange={e=>handleChange('durationHours', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" /></div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Adults</label>
              <input type="number" min="1" value={form.adults} onChange={e=>handleChange('adults', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" /></div>
              <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Children</label>
              <input type="number" min="0" value={form.children} onChange={e=>handleChange('children', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" /></div>
            </div>

            <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Payment Method</label>
            <select value={form.paymentMethod} onChange={e=>handleChange('paymentMethod', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
              <option>Cash</option><option>QR Code</option><option>Card</option><option>UPI</option>
            </select></div>

            <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Initial Status</label>
            <select value={form.paymentStatus} onChange={e=>handleChange('paymentStatus', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
              <option>Paid</option><option>Pending</option><option>Partial</option>
            </select></div>

            <div className="col-span-2"><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Residential Address <span className="text-red-500">*</span></label>
            <textarea rows={2} value={form.address} onChange={e=>handleChange('address', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" placeholder="Enter guest's full address (required)" /></div>

            <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">ID Proof Type</label>
            <select value={form.idProofType} onChange={e=>handleChange('idProofType', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
              <option>Aadhar</option><option>Passport</option><option>VoterID</option><option>Driving Licence</option>
            </select></div>

            <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">ID Proof Number <span className="text-red-500">*</span></label>
            <input value={form.idProofNumber} onChange={e=>handleChange('idProofNumber', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" placeholder="e.g. 1234 5678 9012 (required)" /></div>

            <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Visiting Purpose <span className="text-red-500">*</span></label>
            <select value={form.visitingPurpose} onChange={e=>handleChange('visitingPurpose', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
              <option value="">— Select Purpose —</option><option>Personal</option><option>Business</option><option>Leisure</option><option>Other</option>
            </select></div>

            <div><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Transportation</label>
            <select value={form.transportType} onChange={e=>handleChange('transportType', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200">
              <option>Public Transport</option><option>Vehicle</option>
            </select></div>

            {form.transportType === 'Vehicle' && (
              <div className="col-span-2 animate-fade-in"><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Vehicle Reg. Number</label>
              <input value={form.vehicleRegNumber} onChange={e=>handleChange('vehicleRegNumber', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200" placeholder="e.g. TN30 AL 4727" /></div>
            )}
            <div className="col-span-2"><label className="text-sm font-medium text-gray-600 dark:text-[#a1a1aa] mb-1 block">Special Requests</label>
            <textarea rows={1} value={form.requests} onChange={e=>handleChange('requests', e.target.value)} className="w-full border border-border dark:border-[#2a2a35] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none" placeholder="Any special requests..." /></div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-border dark:border-[#2a2a35] flex justify-end gap-3 bg-gray-50/50 dark:bg-[#13131a]/30">
          <button onClick={onClose} className="px-8 py-3 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-100 transition-all active:scale-95">Cancel</button>
          <button onClick={handleSave} className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95">Confirm Booking</button>
        </div>
      </div>
    </div>
  );
};


import api from '../../services/api';

export default function BookingManagement() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getBookings();
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const stats = [
    { label: 'Total Bookings', value: bookings.length, color: 'bg-blue-50 text-blue-700' },
    { label: 'Checked In', value: bookings.filter(b => b.status === 'Checked In').length, color: 'bg-green-50 text-green-700' },
    { label: 'Reserved', value: bookings.filter(b => b.status === 'Reserved').length, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Checked Out', value: bookings.filter(b => b.status === 'Checked Out').length, color: 'bg-gray-100 dark:bg-[#2a2a35] text-gray-700 dark:text-[#e4e4e7]' },
    { label: 'Revenue (Check-In Today)', value: `₹${bookings.filter(b => b.checkin === new Date().toISOString().split('T')[0]).reduce((s,b) => s + (Number(b.amount) || 0), 0).toLocaleString()}`, color: 'bg-primary-100 text-primary-700' },
    { label: 'Pending Payment', value: bookings.filter(b => b.payment === 'Pending').length, color: 'bg-red-50 text-red-600' },
    { label: 'New Requests', value: bookings.filter(b => b.status === 'Pending').length, color: 'bg-orange-50 text-orange-600 border border-orange-200' },
  ];

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    return (b.guest.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.room.toLowerCase().includes(q))
      && (filterStatus === 'All' || b.status === filterStatus)
      && (filterPayment === 'All' || b.payment === filterPayment);
  });

  return (
    <div className="space-y-6">
      {showModal && <AddBookingModal onClose={() => setShowModal(false)} onSaved={async (b) => {
        try {
          const created = await api.createBooking(b);
          setBookings(prev => [created, ...prev]);
          
          const roomsResponse = await api.getRooms();
          const selectedRoom = roomsResponse.find(r => `${r.roomNumber} - ${r.type}` === b.room);
          if (selectedRoom) {
            await api.updateRoom(selectedRoom._id, { status: 'Occupied' });
          }
          
          setShowModal(false);
        } catch (error) {
          alert('Booking error: ' + error.message);
        }
      }} />}

      {viewBooking && <ViewBookingModal booking={viewBooking} onClose={() => setViewBooking(null)} />}

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1c1c24] rounded-2xl p-4 border border-border dark:border-[#2a2a35] shadow-card flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#a1a1aa]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guest / booking ID..." className="pl-9 pr-4 py-2 border border-border dark:border-[#2a2a35] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 w-56" />
          </div>
          {[
            [filterStatus, setFilterStatus, ['All','Pending','Checked In','Checked Out','Reserved','Confirmed','Cancelled'], 'Status'],
            [filterPayment, setFilterPayment, ['All','Paid','Pending','Partial'], 'Payment'],
          ].map(([val, setter, options, label]) => (
            <div key={label} className="relative">
              <select value={val} onChange={e => setter(e.target.value)} className="pl-3 pr-8 py-2 border border-border dark:border-[#2a2a35] rounded-xl text-sm focus:outline-none appearance-none">
                {options.map(o => <option key={o} value={o}>{o === 'All' ? `All ${label === 'Status' ? 'Statuses' : label + 's'}` : o}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#a1a1aa] pointer-events-none" />
            </div>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 shadow-sm">
          <Plus size={15} /> New Booking
        </button>
      </div>

      <div className="bg-white dark:bg-[#1c1c24] rounded-2xl shadow-card border border-border dark:border-[#2a2a35] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>{['Booking ID','Guest','Room','Type','Check-In','Check-Out','Nights','Amount','Status','Payment','Source','Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a35] dark:bg-[#13131A] transition-colors">
                  <td className="table-cell font-semibold text-primary-600">{b.id}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">{b.guest[0]}</div>
                      <span className="font-medium text-gray-800 dark:text-white">{b.guest}</span>
                    </div>
                  </td>
                  <td className="table-cell font-medium">{b.room}</td>
                  <td className="table-cell text-gray-500 dark:text-[#a1a1aa]">{b.type}</td>
                  <td className="table-cell">{b.checkin}</td>
                  <td className="table-cell">{b.checkout}</td>
                  <td className="table-cell text-center">{b.nights}</td>
                  <td className="table-cell font-semibold text-gray-800 dark:text-white">₹{b.amount.toLocaleString()}</td>
                  <td className="table-cell"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[b.status]}`}>{b.status}</span></td>
                  <td className="table-cell"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PAY_BADGE[b.payment]}`}>{b.payment}</span></td>
                  <td className="table-cell text-gray-500 dark:text-[#a1a1aa]">{b.source}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setViewBooking(b)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-500"><Eye size={14} /></button>
                      {user?.role !== 'receptionist' && (
                        <>
                          <button className="p-1.5 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/40 text-yellow-500"><Edit2 size={14} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/40 text-red-500"><Trash2 size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-border dark:border-[#2a2a35] flex items-center justify-between bg-gray-50 dark:bg-[#13131A]">
          <span className="text-sm text-gray-500 dark:text-[#a1a1aa]">{filtered.length} bookings found</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-white">Total Revenue: ₹{filtered.reduce((s,b) => s+b.amount,0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
