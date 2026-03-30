import React, { useState } from 'react';
import { MessageCircle, Search, Filter, Mail, CheckCircle, Clock, Trash2, Reply, MoreHorizontal, Plus } from 'lucide-react';

export default function QueriesTab() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const stats = [
    { label: 'Unresolved', value: '0', icon: Clock, color: 'bg-orange-50 text-orange-600 border border-orange-100' },
    { label: 'In Progress', value: '0', icon: MessageCircle, color: 'bg-blue-50 text-blue-600 border border-blue-100' },
    { label: 'Resolved Today', value: '0', icon: CheckCircle, color: 'bg-green-50 text-green-600 border border-green-100' },
    { label: 'Total Requests', value: '0', icon: Mail, color: 'bg-gray-100 dark:bg-[#1A1D1F] border border-gray-200 dark:border-[#272B30] text-gray-800 dark:text-white' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Search Header */}
      <div className="bg-white dark:bg-[#1A1D1F] rounded-[32px] p-8 border border-gray-100 dark:border-[#272B30] shadow-sm overflow-hidden relative">
         <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 tracking-tight">Guest Support & Queries</h2>
            <p className="text-sm text-gray-500 font-medium mb-8">Manage and respond to guest inquiries and service requests.</p>
            
            <div className="flex flex-wrap gap-4">
               <div className="relative flex-1 min-w-[300px]">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by ticket ID, guest name or room number..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#272B30] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 dark:text-white border-none shadow-inner"
                  />
               </div>
               <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#272B30] rounded-2xl px-5 border-none shadow-inner">
                  <Filter size={18} className="text-gray-400" />
                  <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-transparent py-4 text-sm font-bold text-gray-600 dark:text-gray-300 focus:outline-none pr-4 min-w-[120px]">
                     <option>All Tickets</option>
                     <option>Urgent</option>
                     <option>Pending</option>
                     <option>Completed</option>
                  </select>
               </div>
            </div>
         </div>
         {/* Decorative Icon */}
         <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
            <MessageCircle size={300} />
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {stats.map(s => {
           const Icon = s.icon;
           return (
             <div key={s.label} className={`${s.color} rounded-3xl p-6 transition-all hover:scale-[1.02] cursor-pointer`}>
                <div className="flex items-center justify-between mb-4">
                   <div className="p-2 rounded-xl bg-white/50 dark:bg-black/20"><Icon size={20} /></div>
                   <MoreHorizontal size={18} className="opacity-40" />
                </div>
                <h4 className="text-4xl font-black mb-1">{s.value}</h4>
                <p className="text-[11px] font-bold uppercase tracking-widest opacity-70">{s.label}</p>
             </div>
           );
         })}
      </div>

      {/* Empty State */}
      <div className="bg-white dark:bg-[#1A1D1F] border border-gray-100 dark:border-[#272B30] rounded-[40px] p-20 flex flex-col items-center justify-center text-center shadow-sm">
         <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center text-primary-500 animate-pulse">
               <Mail size={40} />
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-[#1A1D1F] shadow-md flex items-center justify-center text-primary-500 border border-primary-100">
               <CheckCircle size={16} />
            </div>
         </div>
         <h3 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Inbox Fully Cleared</h3>
         <p className="text-sm text-gray-500 font-medium mt-2 max-w-sm">No unresolved guest tickets found. New queries from the receptionist or website will appear here.</p>
         
         <button className="mt-8 flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-2xl font-bold hover:bg-primary-600 transition-all hover:shadow-xl hover:shadow-primary-500/30">
            <Plus size={20} /> Create Manual Log
         </button>
      </div>
    </div>
  );
}
