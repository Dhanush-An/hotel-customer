import React, { useState } from 'react';
import { Shield, User, Key, Search, ChevronDown, Plus, Eye, Edit2, Trash2, Power, Lock, Unlock } from 'lucide-react';

const cn = (...inputs) => inputs.filter(Boolean).join(' ');

const LOGIN_CREDENTIALS = [
  { id: 'USER01', username: 'admin_arjun', role: 'Admin', status: 'Active', lastLogin: '2024-03-26 10:15 AM' },
  { id: 'USER02', username: 'sub_vikram', role: 'Sub Admin', status: 'Active', lastLogin: '2024-03-25 04:30 PM' },
  { id: 'USER03', username: 'recep_priya', role: 'Receptionist', status: 'Active', lastLogin: '2024-03-26 09:12 AM' },
  { id: 'USER04', username: 'recep_sharma', role: 'Receptionist', status: 'Inactive', lastLogin: '2024-03-20 02:45 PM' },
];

export default function SettingsTab() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = LOGIN_CREDENTIALS.filter(u => u.username.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1A1D1F] dark:text-white">User Authentication Management</h1>
          <p className="text-[11px] font-bold text-gray-400 dark:text-[#a1a1aa] uppercase tracking-widest mt-1">Control system access & credentials</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#DCEB8C] text-[#1A1D1F] dark:text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:shadow-lg transition-all">
          <Plus size={18} /> Add New User
        </button>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: 4, icon: User, color: 'bg-white dark:bg-[#1c1c24]' },
          { label: 'Active Sessions', value: 3, icon: Power, color: 'bg-[#E9F5EF] dark:bg-[#1a221d] text-[#27AE60]' },
          { label: 'Admins', value: 1, icon: Shield, color: 'bg-white dark:bg-[#1c1c24]' },
          { label: 'Pending Reset', value: 0, icon: Key, color: 'bg-white dark:bg-[#1c1c24]' },
        ].map(s => (
          <div key={s.label} className={cn("rounded-[24px] p-6 shadow-sm border border-[#EFF2F5] dark:border-[#2a2a35]", s.color)}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-[12px] font-bold text-[#1A1D1F]/60 dark:text-white/60 uppercase tracking-widest">{s.label}</p>
              <s.icon size={18} className="opacity-50" />
            </div>
            <h3 className="text-4xl font-bold text-[#1A1D1F] dark:text-white">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Management Area */}
      <div className="bg-white dark:bg-[#1c1c24] rounded-[32px] p-8 shadow-sm border border-[#EFF2F5] dark:border-[#2a2a35]">
        <div className="flex justify-between items-center mb-8">
           <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#a1a1aa]" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search by username or role..." 
                className="pl-12 pr-4 py-3 bg-[#F7F9FB] dark:bg-[#13131A] border border-[#EFF2F5] dark:border-[#2a2a35] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#DCEB8C] w-80 shadow-inner" 
              />
           </div>
           <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 border border-[#EFF2F5] dark:border-[#2a2a35] rounded-2xl text-sm font-bold text-gray-500 dark:text-[#a1a1aa] hover:bg-[#F4F4F4] dark:hover:bg-[#2a2a35] dark:bg-[#2a2a35]">
                 Role Level <ChevronDown size={14} />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F9FB] dark:bg-[#13131A]">
                {['User ID','Username','Role','Status','Last Login','Action'].map(h => <th key={h} className="px-6 py-5 text-left text-[11px] font-bold text-[#6F767E] dark:text-[#a1a1aa] uppercase tracking-widest">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F4F4]">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-[#F9FAFB] transition-colors group">
                  <td className="px-6 py-5 font-bold text-[#1A1D1F]/50 dark:text-white/50">{u.id}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F4F4F4] dark:bg-[#2a2a35] flex items-center justify-center text-gray-400 dark:text-[#a1a1aa]"><User size={20} /></div>
                      <p className="font-extrabold text-[#1A1D1F] dark:text-white">{u.username}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className={cn(
                       "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter",
                       u.role === 'Admin' ? 'bg-[#FFE7E4] dark:bg-[#2a1a1c] text-[#FF6A55]' : 'bg-[#E9F5EF] dark:bg-[#1a221d] text-[#27AE60]'
                     )}>{u.role}</span>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", u.status === 'Active' ? 'bg-[#27AE60]' : 'bg-gray-300')}></div>
                        <span className={cn("text-xs font-bold", u.status === 'Active' ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-[#a1a1aa]')}>{u.status}</span>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-400 dark:text-[#a1a1aa]">{u.lastLogin}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center gap-2 justify-end">
                       <button title="Reset Password" className="p-2.5 rounded-xl border border-[#EFF2F5] dark:border-[#2a2a35] text-gray-400 dark:text-[#a1a1aa] hover:text-[#FF6A55] hover:border-[#FF6A55]/30 hover:bg-[#FFE7E4] dark:bg-[#2a1a1c] transition-all">
                          <Lock size={16} />
                       </button>
                       <button title="Toggle Status" className={cn(
                         "p-2.5 rounded-xl border transition-all",
                         u.status === 'Active' ? 'border-[#EFF2F5] dark:border-[#2a2a35] text-gray-400 dark:text-[#a1a1aa] hover:text-[#27AE60]' : 'text-[#27AE60] border-[#C7E3D4] bg-[#E9F5EF] dark:bg-[#1a221d]'
                       )}>
                          <Power size={16} />
                       </button>
                       <button className="p-2.5 rounded-xl border border-[#EFF2F5] dark:border-[#2a2a35] text-gray-400 dark:text-[#a1a1aa] hover:bg-gray-100 dark:hover:bg-[#2a2a35] dark:bg-[#2a2a35]"><Edit2 size={16} /></button>
                       <button className="p-2.5 rounded-xl border border-[#EFF2F5] dark:border-[#2a2a35] text-gray-400 dark:text-[#a1a1aa] hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Security Policy Box */}
      <div className="bg-[#1A1D1F] rounded-[32px] p-8 shadow-premium relative overflow-hidden group">
         <div className="absolute right-0 top-0 p-8 opacity-10"><Key size={80} /></div>
         <p className="text-[#C7E3D4] text-[10px] font-bold uppercase tracking-widest mb-3">Security Policy</p>
         <h3 className="text-2xl font-bold text-white mb-6">Credential Policy Control</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: '2FA Enforcement', enabled: true },
              { label: 'Auto Password Expiry (90d)', enabled: false },
              { label: 'Brute Force Lockout', enabled: true },
            ].map((p, i) => (
              <div key={i} className="bg-white/5 dark:bg-[#1c1c24]/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                 <span className="text-sm font-bold text-white/80">{p.label}</span>
                 <div className={cn("w-10 h-6 rounded-full relative cursor-pointer transition-colors p-1", p.enabled ? 'bg-[#DCEB8C]' : 'bg-white/20 dark:bg-[#1c1c24]/20')}>
                    <div className={cn("w-4 h-4 bg-white dark:bg-[#1c1c24] rounded-full transition-all shadow-md", p.enabled ? 'ml-4' : 'ml-0')}></div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
