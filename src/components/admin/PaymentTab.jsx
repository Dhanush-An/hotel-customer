import React, { useState, useEffect } from 'react';
import { Search, Eye, Download, CreditCard, Smartphone, Banknote, Building2, CheckCircle, Clock, XCircle, ChevronDown } from 'lucide-react';

const safeDate = () => new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'});

const METHOD_ICON = {
  Card: CreditCard,
  UPI: Smartphone,
  Cash: Banknote,
  'Bank Transfer': Building2,
};

const STATUS_BADGE = {
  Completed: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Partial: 'bg-orange-100 text-orange-600',
  Failed: 'bg-red-100 text-red-600',
  Refunded: 'bg-purple-100 text-purple-700',
};

const STATUS_ICON = {
  Completed: <CheckCircle size={14} className="text-green-500" />,
  Pending: <Clock size={14} className="text-yellow-500" />,
  Partial: <Clock size={14} className="text-orange-500" />,
  Failed: <XCircle size={14} className="text-red-500" />,
};

import api from '../../services/api';

export default function PaymentTab() {
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [PAYMENTS, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await api.getPayments();
      if (data.length === 0) {
        const bookings = await api.getBookings();
        const derived = bookings.map(b => ({
          id: `PAY-${(b._id || b.id || '').toString().slice(-4)}`,
          booking: (b._id || b.id || '').toString(),
          guest: b.guest || 'Unknown Guest',
          room: b.room || 'N/A',
          amount: b.amount || 0,
          method: b.method || 'Cash',
          date: b.createdAt || new Date().toISOString(),
          status: b.payment === 'Paid' ? 'Completed' : b.payment === 'Pending' ? 'Pending' : 'Partial',
          ref: `REF${Math.floor(10000000 + Math.random() * 90000000)}`
        }));
        setPayments(derived);
      } else {
        setPayments(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalCollected = PAYMENTS.filter(p => (p.status || '').toLowerCase() === 'completed').reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const totalPending = PAYMENTS.filter(p => (p.status || '').toLowerCase() === 'pending').reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const stats = [
    { label: 'Total Collected', value: `₹${totalCollected.toLocaleString()}`, color: 'bg-green-50 text-green-700', icon: CheckCircle },
    { label: 'Pending Payments', value: `₹${totalPending.toLocaleString()}`, color: 'bg-yellow-50 text-yellow-700', icon: Clock },
    { label: 'Total Transactions', value: PAYMENTS.length, color: 'bg-blue-50 text-blue-700', icon: CreditCard },
    { label: 'Via Card', value: PAYMENTS.filter(p => p.method === 'Card').length, color: 'bg-purple-50 text-purple-700', icon: CreditCard },
    { label: 'Via UPI', value: PAYMENTS.filter(p => p.method === 'UPI').length, color: 'bg-orange-50 text-orange-600', icon: Smartphone },
    { label: 'Via Cash', value: PAYMENTS.filter(p => p.method === 'Cash').length, color: 'bg-gray-100 dark:bg-[#2a2a35] text-gray-700 dark:text-[#e4e4e7]', icon: Banknote },
  ];

  const filtered = PAYMENTS.filter(p => {
    const q = (search || '').toLowerCase();
    const guest = (p.guest || '').toLowerCase();
    const id = (p.id || '').toLowerCase();
    const bId = (p.booking || '').toLowerCase();
    
    return (guest.includes(q) || id.includes(q) || bId.includes(q))
      && (filterMethod === 'All' || p.method === filterMethod)
      && (filterStatus === 'All' || p.status === filterStatus);
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
              <Icon size={20} className="mx-auto mb-1 opacity-80" />
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-[#1c1c24] rounded-2xl p-4 border border-border dark:border-[#2a2a35] shadow-card flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#a1a1aa]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guest / payment ID..." className="pl-9 pr-4 py-2 border border-border dark:border-[#2a2a35] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 w-56" />
          </div>
          {[
            [filterMethod, setFilterMethod, ['All','Card','UPI','Cash','Bank Transfer'], 'Method'],
            [filterStatus, setFilterStatus, ['All','Completed','Pending','Partial','Refunded'], 'Status'],
          ].map(([val, setter, options, label]) => (
            <div key={label} className="relative">
              <select value={val} onChange={e => setter(e.target.value)} className="pl-3 pr-8 py-2 border border-border dark:border-[#2a2a35] rounded-xl text-sm focus:outline-none appearance-none">
                {options.map(o => <option key={o} value={o}>{o === 'All' ? `All ${label === 'Status' ? 'Statuses' : label + 's'}` : o}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#a1a1aa] pointer-events-none" />
            </div>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border dark:border-[#2a2a35] rounded-xl text-sm text-gray-600 dark:text-[#a1a1aa] hover:bg-gray-50 dark:hover:bg-[#2a2a35] dark:bg-[#13131A]"><Download size={15} /> Export</button>
      </div>

      <div className="bg-white dark:bg-[#1c1c24] rounded-2xl shadow-card border border-border dark:border-[#2a2a35] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>{['Payment ID','Booking ID','Guest','Room','Amount','Method','Date','Status','Ref No.','Actions'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
            </thead>
            <tbody>
                {filtered.map(p => {
                  const Icon = METHOD_ICON[p.method] || CreditCard;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a35] dark:bg-[#13131A] transition-colors">
                    <td className="table-cell font-semibold text-primary-600">{p.id}</td>
                    <td className="table-cell font-medium text-gray-600 dark:text-[#a1a1aa]">{p.booking}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs">{p.guest[0]}</div>
                        <span className="font-medium text-gray-800 dark:text-white">{p.guest}</span>
                      </div>
                    </td>
                    <td className="table-cell font-medium">{p.room}</td>
                    <td className="table-cell font-semibold text-gray-800 dark:text-white">₹{p.amount.toLocaleString()}</td>
                    <td className="table-cell">
                      <span className="flex items-center gap-1.5 text-gray-600 dark:text-[#a1a1aa]">
                        <Icon size={14} className="text-gray-400 dark:text-[#a1a1aa]" /> {p.method}
                      </span>
                    </td>
                    <td className="table-cell">{p.date}</td>
                    <td className="table-cell">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${STATUS_BADGE[p.status]}`}>
                        {STATUS_ICON[p.status]} {p.status}
                      </span>
                    </td>
                    <td className="table-cell font-mono text-gray-500 dark:text-[#a1a1aa] text-xs">{p.ref}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-500"><Eye size={14} /></button>
                        <button className="p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/40 text-purple-500"><Download size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#2a2a35] bg-gray-50 dark:bg-[#13131A] flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-[#a1a1aa]">{filtered.length} transactions</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-white">Total: ₹{filtered.reduce((s,p) => s+p.amount, 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
