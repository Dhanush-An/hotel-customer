import React, { useState, useEffect } from 'react';
import {
  BedDouble, Search, LayoutGrid, List, Plus, Upload, Download,
  Eye, Edit2, Trash2, CheckCircle, Wrench, UserCheck, X, ChevronDown,
  Wifi, Tv, Wind, Loader2, AlertCircle, CheckCheck
} from 'lucide-react';



const STATUS_COLOR = {
  Available:       'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20',
  Occupied:        'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20',
  Reserved:        'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20',
  Cleaning:        'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
  Maintenance:     'bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/20',
  'Out of Service':'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20',
};

const STATUS_DOT = {
  Available:       'bg-green-500',
  Occupied:        'bg-red-500',
  Reserved:        'bg-yellow-500',
  Cleaning:        'bg-blue-500',
  Maintenance:     'bg-gray-400',
  'Out of Service':'bg-orange-500',
};

const STATIC_ROOMS = [];

const INIT_FORM = {
  roomNumber: '', name: '', floor: '', maxOccupancy: '', roomSize: '', numberOfBeds: '',
  type: 'Deluxe', bedType: 'King',
  price: '', weekendPrice: '', discountPrice: '', extraBedCharge: '',
  facilities: { ac: false, wifi: false, tv: false, bathroom: false, balcony: false, miniFridge: false, roomService: false, breakfastIncluded: false },
  status: 'Available',
};

const StatusBadge = ({ status }) => (
  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${STATUS_DOT[status] || 'bg-gray-400'}`}></span>
    {status}
  </span>
);

const HKBadge = ({ status }) => {
  const map = { Clean: 'bg-green-50 text-green-600', Dirty: 'bg-red-50 text-red-600', 'In Progress': 'bg-blue-50 text-blue-600', Inspected: 'bg-purple-50 text-purple-600' };
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${map[status] || 'bg-gray-50 text-gray-500'}`}>{status}</span>;
};

/* ─── Toast ────────────────────────────────── */
const Toast = ({ msg, type, onClose }) => (
  <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-semibold animate-fade-in
    ${type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
    {type === 'success' ? <CheckCheck size={18} /> : <AlertCircle size={18} />}
    {msg}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={16} /></button>
  </div>
);

/* ─── Add Room Modal ───────────────────────── */
const AddRoomModal = ({ onClose, onSaved, initialData = null }) => {
  const [tab, setTab] = useState('basic');
  const [form, setForm] = useState(initialData || INIT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const tabs = ['basic', 'pricing', 'facilities', 'status'];

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const setFacility = (key) => setForm(prev => ({
    ...prev,
    facilities: { ...prev.facilities, [key]: !prev.facilities[key] }
  }));

  const handleSave = async () => {
    setError('');
    // Basic validation
    if (!form.roomNumber.trim()) { setTab('basic'); setError('Room Number is required.'); return; }
    if (!form.name.trim())       { setTab('basic'); setError('Room Name is required.'); return; }
    if (!form.floor)             { setTab('basic'); setError('Floor Number is required.'); return; }
    if (!form.price)             { setTab('pricing'); setError('Price per Night is required.'); return; }

    const payload = {
      roomNumber:     form.roomNumber.trim(),
      name:           form.name.trim(),
      floor:          String(form.floor).trim(),
      maxOccupancy:   Number(form.maxOccupancy) || 2,
      roomSize:       form.roomSize.trim(),
      numberOfBeds:   Number(form.numberOfBeds) || 1,
      type:           form.type,
      bedType:        form.bedType,
      price:          Number(form.price),
      weekendPrice:   Number(form.weekendPrice) || 0,
      discountPrice:  Number(form.discountPrice) || 0,
      extraBedCharge: Number(form.extraBedCharge) || 0,
      facilities:     form.facilities,
      status:         form.status,
    };

    setSaving(true);
    // Mock save
    setTimeout(() => {
      setSaving(false);
      if (initialData) {
        onSaved({ ...initialData, ...payload });
      } else {
        onSaved(payload);
      }
    }, 800);
  };

  const inputCls = 'w-full border border-gray-200 dark:border-[#272B30] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white dark:bg-[#272B30] text-gray-800 dark:text-white';
  const labelCls = 'text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block';

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1A1D1F] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-100 dark:border-[#272B30]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-[#272B30]">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{initialData ? 'Edit Room' : 'Add New Room'}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{initialData ? 'Update this room details' : 'Fill in the details to register a new room'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#272B30] text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-[#272B30] px-6">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors -mb-px
                ${tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Form Body */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* ── Basic Tab ── */}
          {tab === 'basic' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                ['roomNumber', 'Room Number', 'e.g. 101', 'text'],
                ['name',       'Room Name',   'e.g. Sky Suite', 'text'],
              ].map(([field, label, ph, type]) => (
                <div key={field}>
                  <label className={labelCls}>{label}</label>
                  <input
                    type={type}
                    placeholder={ph}
                    value={form[field]}
                    onChange={e => set(field, e.target.value)}
                    className={inputCls}
                  />
                </div>
              ))}

              <div>
                <label className={labelCls}>Floor Number</label>
                <select 
                  value={form.floor} 
                  onChange={e => set('floor', e.target.value)} 
                  className={inputCls}
                >
                  <option value="" disabled>Select Floor</option>
                  <option value="Ground">Ground Floor</option>
                  {[1, 2, 3, 4, 5, 6].map(f => (
                    <option key={f} value={f}>Floor {f}</option>
                  ))}
                </select>
              </div>

              {[
                ['maxOccupancy','Max Occupancy','e.g. 2','number'],
                ['roomSize',   'Room Size',   'e.g. 350 sqft','text'],
                ['numberOfBeds','Number of Beds','e.g. 1','number'],
              ].map(([field, label, ph, type]) => (
                <div key={field}>
                  <label className={labelCls}>{label}</label>
                  <input
                    type={type}
                    placeholder={ph}
                    value={form[field]}
                    onChange={e => set(field, e.target.value)}
                    className={inputCls}
                  />
                </div>
              ))}

              <div>
                <label className={labelCls}>Room Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)} className={inputCls}>
                  {['Deluxe','Standard','Suite','Single','Double'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Bed Type</label>
                <select value={form.bedType} onChange={e => set('bedType', e.target.value)} className={inputCls}>
                  {['King','Queen','Single','Double','Twin'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── Pricing Tab ── */}
          {tab === 'pricing' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                ['price',          'Price per Night (₹)'],
                ['weekendPrice',   'Weekend Price (₹)'],
                ['discountPrice',  'Discount Price (₹)'],
                ['extraBedCharge', 'Extra Bed Charge (₹)'],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className={labelCls}>{label}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={form[field]}
                    onChange={e => set(field, e.target.value)}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── Facilities Tab ── */}
          {tab === 'facilities' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                ['ac',               'AC'],
                ['wifi',             'WiFi'],
                ['tv',               'TV'],
                ['bathroom',         'Bathroom'],
                ['balcony',          'Balcony'],
                ['miniFridge',       'Mini Fridge'],
                ['roomService',      'Room Service'],
                ['breakfastIncluded','Breakfast Included'],
              ].map(([key, label]) => (
                <label
                  key={key}
                  onClick={() => setFacility(key)}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors
                    ${form.facilities[key]
                      ? 'bg-primary-50 dark:bg-primary-500/10 border-primary-300 dark:border-primary-500/40 text-primary-700 dark:text-primary-400'
                      : 'bg-gray-50 dark:bg-[#272B30] border-gray-200 dark:border-[#3a3a45] text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#343440]'}`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${form.facilities[key] ? 'bg-primary-500 border-primary-500' : 'border-gray-300'}`}>
                    {form.facilities[key] && <CheckCheck size={12} className="text-white" />}
                  </div>
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          )}

          {/* ── Status Tab ── */}
          {tab === 'status' && (
            <div className="grid grid-cols-2 gap-3">
              {['Available','Occupied','Reserved','Cleaning','Maintenance','Out of Service'].map(s => (
                <label
                  key={s}
                  onClick={() => set('status', s)}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors
                    ${form.status === s
                      ? 'bg-primary-50 dark:bg-primary-500/10 border-primary-400 dark:border-primary-500/40 text-primary-700 dark:text-primary-400'
                      : 'bg-gray-50 dark:bg-[#272B30] border-gray-200 dark:border-[#3a3a45] text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#343440]'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${form.status === s ? 'border-primary-500' : 'border-gray-300'}`}>
                    {form.status === s && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                  </div>
                  <span className="text-sm font-medium">{s}</span>
                  <span className={`ml-auto w-2 h-2 rounded-full ${STATUS_DOT[s] || 'bg-gray-400'}`} />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#272B30] flex justify-between items-center gap-3">
          <div className="flex gap-1.5">
            {tabs.map((t, i) => (
              <div key={t} className={`h-1.5 rounded-full transition-all ${tab === t ? 'w-6 bg-primary-500' : 'w-1.5 bg-gray-200'}`} />
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2.5 border border-gray-200 dark:border-[#272B30] rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#272B30] transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 shadow-md shadow-primary-500/20 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Plus size={16} /> {initialData ? 'Update Room' : 'Save Room'}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewRoomModal = ({ data, onClose }) => {
  if (!data) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1A1D1F] w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-[#272B30]">
          <X size={20} />
        </button>
        <div className="flex justify-between items-start mb-6 pt-2">
          <div>
            <span className="text-sm text-gray-400 font-medium">Room {data.roomNumber}</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{data.name}</h2>
          </div>
          <StatusBadge status={data.status} />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Type</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.type}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Floor</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.floor}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Price/Night</p>
            <p className="text-sm font-bold text-primary-600 dark:text-primary-400">₹{(data.price || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Bed Type</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.bedType}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Max Occupancy</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.maxOccupancy} Persons</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Room Size</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{data.roomSize || 'N/A'}</p>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-100 dark:bg-[#272B30] text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Room Card (Grid View) ────────────────── */
const RoomCard = ({ room, onAction }) => (
  <div className="bg-white dark:bg-[#1A1D1F] rounded-2xl p-5 border border-gray-100 dark:border-[#272B30] shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-3">
    <div className="flex justify-between items-start">
      <div>
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Room {room.roomNumber}</span>
        <h4 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">{room.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{room.type} · Floor {room.floor}</p>
      </div>
      <StatusBadge status={room.status} />
    </div>

    <div className="flex items-center gap-3 text-gray-400 text-xs">
      {room.facilities?.ac   && <span className="flex items-center gap-1"><Wind size={13} /> AC</span>}
      {room.facilities?.wifi && <span className="flex items-center gap-1"><Wifi size={13} /> WiFi</span>}
      {room.facilities?.tv   && <span className="flex items-center gap-1"><Tv size={13} /> TV</span>}
      <span className="flex items-center gap-1"><BedDouble size={13} /> {room.bedType}</span>
    </div>

    <div className="border-t border-gray-100 dark:border-[#272B30] pt-3">
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">Price/Night</p>
        <p className="text-base font-bold text-primary-600 dark:text-primary-400">₹{(room.price || 0).toLocaleString()}</p>
      </div>
    </div>

    <div className="flex gap-2 mt-1">
      <button onClick={() => onAction('view', room)} className="flex-1 text-xs border border-gray-200 dark:border-[#272B30] rounded-lg px-2 py-2 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 transition-colors flex items-center justify-center gap-1">
        <Eye size={13} /> View
      </button>
      {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))?.role !== 'receptionist' && (
        <>
          <button onClick={() => onAction('edit', room)} className="flex-1 text-xs border border-gray-200 dark:border-[#272B30] rounded-lg px-2 py-2 text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 hover:text-yellow-600 transition-colors flex items-center justify-center gap-1">
            <Edit2 size={13} /> Edit
          </button>
          <button onClick={() => onAction('delete', room)} className="flex-1 text-xs bg-red-500 text-white rounded-lg px-2 py-2 hover:bg-red-600 transition-colors flex items-center justify-center gap-1 font-bold">
            <Trash2 size={13} /> Delete
          </button>
        </>
      )}
    </div>
  </div>
);

/* ─── Main Component ───────────────────────── */
const statuses = ['All', 'Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance'];
const types    = ['All', 'Deluxe', 'Standard', 'Suite', 'Single', 'Double'];
const floors   = ['All', 'Ground', '1', '2', '3', '4', '5', '6'];

import api from '../../services/api';

export default function RoomManagement() {
  const [user] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [view,         setView]        = useState('table');
  const [search,       setSearch]      = useState('');
  const [filterStatus, setFilterStatus]= useState('All');
  const [filterType,   setFilterType]  = useState('All');
  const [filterFloor,  setFilterFloor] = useState('All');
  const [showModal,    setShowModal]   = useState(false);
  const [viewModal,    setViewModal]   = useState(null);
  const [editModal,    setEditModal]   = useState(null);
  const [rooms,        setRooms]       = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [toast,        setToast]       = useState(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await api.getRooms();
      setRooms(data);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaved = async (newRoom) => {
    try {
      if (editModal) {
        const updated = await api.updateRoom(editModal._id, newRoom);
        setRooms(prev => prev.map(r => r._id === updated._id ? updated : r));
        setEditModal(null);
        showToast(`Room ${updated.roomNumber} updated successfully!`);
      } else {
        const created = await api.createRoom(newRoom);
        setRooms(prev => [created, ...prev]);
        setShowModal(false);
        showToast(`Room ${created.roomNumber} – ${created.name} added successfully!`);
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const countBy = (status) => rooms.filter(r => r.status === status).length;

  const stats = [
    { label: 'Total Rooms', value: rooms.length,             color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700' },
    { label: 'Available',   value: countBy('Available'),      color: 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20' },
    { label: 'Occupied',    value: countBy('Occupied'),       color: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20' },
    { label: 'Reserved',    value: countBy('Reserved'),       color: 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20' },
    { label: 'Cleaning',    value: countBy('Cleaning'),       color: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20' },
    { label: 'Maintenance', value: countBy('Maintenance'),    color: 'bg-gray-200 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-500/20' },
  ];

  const filtered = rooms.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = (r.roomNumber || '').toLowerCase().includes(q)
      || (r.name || '').toLowerCase().includes(q)
      || (r.guest || '').toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchType   = filterType   === 'All' || r.type   === filterType;
    const matchFloor  = filterFloor  === 'All' || String(r.floor) === filterFloor;
    return matchSearch && matchStatus && matchType && matchFloor;
  });

  const handleAction = async (action, room) => {
    if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete Room ${room.roomNumber}?`)) {
        try {
          await api.deleteRoom(room._id);
          setRooms(prev => prev.filter(r => r._id !== room._id));
          showToast('Room deleted successfully', 'success');
        } catch (error) {
          showToast(error.message, 'error');
        }
      }
    } else if (action === 'view') {
      setViewModal(room);
    } else if (action === 'edit') {
      setEditModal(room);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modal */}
      {showModal && <AddRoomModal onClose={() => setShowModal(false)} onSaved={handleSaved} />}
      {editModal && <AddRoomModal initialData={editModal} onClose={() => setEditModal(null)} onSaved={handleSaved} />}
      {viewModal && <ViewRoomModal data={viewModal} onClose={() => setViewModal(null)} />}

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-[#1A1D1F] rounded-2xl p-4 border border-gray-100 dark:border-[#272B30] shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search room / guest..."
              className="pl-9 pr-4 py-2 border border-gray-300 dark:border-[#272B30] rounded-xl text-sm bg-white dark:bg-[#272B30] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 w-52"
            />
          </div>
          {[[filterStatus, setFilterStatus, statuses, 'Status'], [filterType, setFilterType, types, 'Type'], [filterFloor, setFilterFloor, floors, 'Floor']].map(([val, setter, options, label]) => (
            <div key={label} className="relative">
              <select
                value={val}
                onChange={e => setter(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 dark:border-[#272B30] rounded-xl text-sm bg-white dark:bg-[#1A1D1F] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-300 appearance-none"
              >
                {options.map(o => <option key={o} value={o}>{o === 'All' ? `All ${label === 'Status' ? 'Statuses' : label + 's'}` : o}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-[#272B30] rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#272B30] transition-colors">
            <Upload size={15} /> Bulk Upload
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-[#272B30] rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#272B30] transition-colors">
            <Download size={15} /> Export
          </button>
          {user?.role !== 'receptionist' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 shadow-sm shadow-primary-500/20 transition-colors"
            >
              <Plus size={15} /> Add Room
            </button>
          )}
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView('table')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${view === 'table' ? 'bg-primary-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600'}`}
        >
          <List size={16} /> Table View
        </button>
        <button
          onClick={() => setView('grid')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${view === 'grid' ? 'bg-primary-500 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600'}`}
        >
          <LayoutGrid size={16} /> Grid View
        </button>
        <span className="ml-auto text-sm text-gray-500">
          {loading ? 'Loading…' : `${filtered.length} rooms found`}
        </span>
      </div>

      {/* Table View */}
      {view === 'table' && (
        <div className="bg-white dark:bg-[#1A1D1F] rounded-2xl shadow-sm border border-gray-100 dark:border-[#272B30] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#272B30] border-b border-gray-200 dark:border-[#3a3a45]">
                  {['Room No', 'Type', 'Floor', 'Bed Type', 'Price/Night', 'Status', 'Housekeeping', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-500 dark:text-[#a1a1aa] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#272B30]">
                {filtered.map(room => (
                  <tr key={room._id} className="hover:bg-gray-50 dark:hover:bg-[#272B30] transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap font-bold text-gray-800 dark:text-gray-200 text-sm">{room.roomNumber}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300 text-sm">{room.type}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300 text-sm">{room.floor}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300 text-sm">{room.bedType}</td>
                    <td className="px-5 py-4 whitespace-nowrap font-semibold text-primary-600 dark:text-primary-400 text-sm">₹{(room.price || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 whitespace-nowrap"><StatusBadge status={room.status} /></td>

                    <td className="px-5 py-4 whitespace-nowrap"><HKBadge status={room.housekeeping || 'Clean'} /></td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleAction('view', room)}        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10   text-blue-500   transition-colors" title="View">        <Eye         size={15} /></button>
                        {user?.role !== 'receptionist' && (
                          <>
                            <button onClick={() => handleAction('edit', room)}        className="p-1.5 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-500/10 text-yellow-600 transition-colors" title="Edit">        <Edit2       size={15} /></button>
                            <button onClick={() => handleAction('delete', room)}      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10    text-red-500    transition-colors" title="Delete">      <Trash2      size={15} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-14 text-gray-400 text-sm font-medium">No rooms found matching your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(room => <RoomCard key={room._id} room={room} onAction={handleAction} />)}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400 text-sm">No rooms found matching your filters.</div>
          )}
        </div>
      )}
    </div>
  );
}
