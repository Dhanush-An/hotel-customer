import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Hotel, Bell, Settings, Menu,
  Sun, Moon, X, BedDouble, ClipboardList, Clock, CheckCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Chatbot from '../components/common/Chatbot';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import api from '../services/api';

function useNotifications(role) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAndBuildNotifications = async () => {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      const [bookings, rooms, tasks] = await Promise.all([
        api.getBookings(),
        api.getRooms(),
        api.getTasks()
      ]);

      const newNotifs = [];

      // ── Checkout alerts ──
      if (role === 'receptionist' || role === 'admin') {
        const checkedIn = bookings.filter(b => b.status === 'Checked In' && b.checkout === today);
        checkedIn.forEach(b => {
          const coTime = b.checkoutTime || '12:00';
          const [ch, cm] = coTime.split(':').map(Number);
          const checkoutMs = new Date(today).setHours(ch, cm, 0, 0);
          const diffMins = (checkoutMs - now.getTime()) / 60000;
          
          if (diffMins > 0 && diffMins <= 15) {
            newNotifs.push({ id: `checkout-15-${b._id}`, type: 'upcoming', category: 'checkout', title: `Checkout in ${Math.round(diffMins)} min`, body: `${b.guest} · Room ${b.room}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false, link: 'checkout' });
          }
          if (diffMins < 0) {
            newNotifs.push({ id: `checkout-overdue-${b._id}`, type: 'overdue', category: 'checkout', title: 'Overdue Check-out', body: `${b.guest} · Room ${b.room}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false, link: 'checkout' });
          }
        });
      }

      // ── Cleaning alerts ──
      if (role === 'housekeeping' || role === 'roomboy' || role === 'admin') {
        const cleaningRooms = rooms.filter(r => r.status === 'Cleaning' || r.status === 'Dirty');
        cleaningRooms.forEach(r => {
          newNotifs.push({ id: `cleaning-${r._id}`, type: 'cleaning', category: 'cleaning', title: 'Room Needs Cleaning', body: `Room ${r.roomNumber} · ${r.type}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false, link: 'cleanup' });
        });
      }

      // ── Task alerts ──
      const activeTasks = tasks.filter(t => t.column !== 'Completed');
      activeTasks.forEach(t => {
        newNotifs.push({ id: `task-${t._id}`, type: 'task', category: 'task', title: 'New Task Assigned', body: `${t.title} · ${t.assignee || 'Unassigned'}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false, link: 'tasks' });
      });

      setNotifications(newNotifs);
    } catch (err) {
      console.error("Notif error:", err);
    }
  };

  useEffect(() => {
    fetchAndBuildNotifications();
    const iv = setInterval(fetchAndBuildNotifications, 60000);
    return () => clearInterval(iv);
  }, [role]);

  const markRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifs(updated);
  };

  const markAllRead = () => saveNotifs(notifications.map(n => ({ ...n, read: true })));

  const dismiss = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifs(updated);
  };

  const unread = notifications.filter(n => !n.read).length;
  return { notifications, unread, markRead, markAllRead, dismiss };
}

/* ─── Notification Panel ─── */
function NotificationPanel({ notifications, onMarkRead, onMarkAllRead, onDismiss, onNavigate, onClose }) {
  const TYPE_STYLE = {
    upcoming: 'border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10',
    overdue:  'border-l-4 border-red-400 bg-red-50 dark:bg-red-900/10',
    cleaning: 'border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10',
    task:     'border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/10',
  };
  const TYPE_DOT = {
    upcoming: 'bg-yellow-400',
    overdue:  'bg-red-500',
    cleaning: 'bg-yellow-400',
    task:     'bg-blue-500',
  };

  return (
    <div className="absolute right-0 top-12 w-96 bg-white dark:bg-[#1A1D1F] border border-[#EFF2F5] dark:border-[#272B30] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#EFF2F5] dark:border-[#272B30]">
        <h3 className="font-bold text-gray-800 dark:text-white text-sm">Notifications</h3>
        <div className="flex gap-2 items-center">
          <button onClick={onMarkAllRead} className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:text-primary-700">All Read</button>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-[#272B30] rounded-lg text-gray-400"><X size={16} /></button>
        </div>
      </div>
      <div className="max-h-[480px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle size={32} className="mx-auto text-gray-200 dark:text-[#2a2a35] mb-3" />
            <p className="text-sm font-bold text-gray-400 dark:text-[#a1a1aa]">All caught up!</p>
            <p className="text-xs text-gray-300 dark:text-[#555] mt-1">No new notifications</p>
          </div>
        ) : notifications.map(n => (
          <div key={n.id}
            className={cn('px-5 py-4 cursor-pointer transition-all hover:opacity-80', TYPE_STYLE[n.type] || 'bg-white dark:bg-[#1A1D1F]', !n.read ? 'opacity-100' : 'opacity-60')}
            onClick={() => { onMarkRead(n.id); if (n.link && onNavigate) onNavigate(n.link); }}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-start gap-2 flex-1">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${TYPE_DOT[n.type] || 'bg-gray-400'}`} />
                <div>
                  <p className="text-xs font-black text-gray-800 dark:text-white">{n.title}</p>
                  <p className="text-[11px] text-gray-500 dark:text-[#a1a1aa] mt-0.5">{n.body}</p>
                  <p className="text-[10px] text-gray-400 dark:text-[#555] mt-1 flex items-center gap-1"><Clock size={10} /> {n.time}</p>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); onDismiss(n.id); }}
                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-gray-400 flex-shrink-0">
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Layout ─── */
const DashboardLayout = ({ title, role, children, menuItems, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const bellRef = useRef(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { notifications, unread, markRead, markAllRead, dismiss } = useNotifications(role);

  const [user] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      if (saved && saved !== 'undefined') return JSON.parse(saved);
      return { name: 'Admin', role: 'Administrator' };
    } catch { return { name: 'Admin', role: 'Administrator' }; }
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark'; } catch { return false; }
  });

  useEffect(() => {
    if (isDarkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [isDarkMode]);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => { if (bellRef.current && !bellRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotifNavigate = (link) => {
    setShowNotifs(false);
    if (link && setActiveTab) setActiveTab(link);
  };

  return (
    <div className="flex h-screen bg-[#F7F9FB] dark:bg-[#111315] overflow-hidden text-[#1A1D1F] dark:text-white transition-colors duration-300 relative">
      <Chatbot />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#1A1D1F] border-r border-[#EFF2F5] dark:border-[#272B30] flex flex-col transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-20 flex items-center justify-between px-6 mb-4 mt-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#C7E3D4] dark:bg-[#272B30] rounded-xl flex items-center justify-center text-[#1A1D1F] dark:text-white shadow-sm shrink-0">
               <Hotel size={24} />
             </div>
             <h1 className="font-extrabold text-sm md:text-lg tracking-tight text-[#1A1D1F] dark:text-white whitespace-nowrap">HOTEL GLITZ</h1>
          </div>
          <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
             <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                className={cn(
                  'w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group',
                  isActive
                    ? 'bg-[#DCEB8C] dark:bg-[#272B30] text-[#1A1D1F] dark:text-white shadow-sm font-bold'
                    : 'text-[#6F767E] hover:bg-[#F4F4F4] dark:hover:bg-[#272B30] hover:text-[#1A1D1F] dark:hover:text-white'
                )}>
                <Icon size={20} className={cn(isActive ? 'text-[#1A1D1F] dark:text-white' : 'text-[#6F767E] group-hover:text-[#1A1D1F] dark:group-hover:text-white')} />
                <span className="text-sm leading-none">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#EFF2F5] dark:border-[#272B30]">
          <button
            onClick={() => {
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="w-full flex items-center justify-center lg:justify-start space-x-3 px-4 py-4 rounded-2xl transition-all text-[#6F767E] hover:bg-[#FFE7E4] dark:hover:bg-[#FF6A55]/10 hover:text-[#FF6A55]">
            <LogOut size={20} />
            <span className="font-bold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full lg:w-auto">
        <header className="h-20 px-4 md:px-8 flex items-center justify-between shrink-0 z-10 bg-[#F7F9FB] dark:bg-[#111315] transition-colors duration-300">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:hover:bg-[#272B30]">
               <Menu size={24} />
             </button>
             <h2 className="text-lg md:text-[28px] font-extrabold text-[#1A1D1F] dark:text-white tracking-tight truncate max-w-[150px] sm:max-w-none">{title}</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsSidebarOpen(false)} // Just to satisfy any layout issues, not actually mapping it 
              className="hidden" />
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 md:w-12 md:h-12 flex flex-shrink-0 items-center justify-center text-[#6F767E] dark:text-white hover:bg-[#F4F4F4] dark:hover:bg-[#272B30] rounded-xl md:rounded-2xl transition-colors bg-white dark:bg-[#1A1D1F] border border-[#EFF2F5] dark:border-[#272B30] shadow-sm">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex items-center gap-3 bg-white dark:bg-[#1A1D1F] p-1 pr-4 rounded-2xl border border-[#EFF2F5] dark:border-[#272B30] shadow-sm transition-colors duration-300">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" className="w-10 h-10 rounded-xl object-cover" alt="user" />
              <div className="hidden lg:block leading-tight pt-1">
                <p className="text-sm font-bold text-[#1A1D1F] dark:text-white">{user.name}</p>
                <p className="text-[11px] font-bold text-[#6F767E] opacity-60 uppercase">{user.role}</p>
              </div>
              <div className="ml-2 flex gap-1">
                <button className="p-2 text-[#6F767E] hover:bg-[#F4F4F4] dark:hover:bg-[#272B30] rounded-xl transition-colors">
                  <Settings size={18} />
                </button>
                {/* Notification Bell */}
                <div ref={bellRef} className="relative">
                  <button
                    onClick={() => setShowNotifs(v => !v)}
                    className="p-2 text-[#6F767E] hover:bg-[#F4F4F4] dark:hover:bg-[#272B30] rounded-xl transition-colors relative">
                    <Bell size={18} />
                    {unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#FF6A55] text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-[#1A1D1F] px-1">
                        {unread > 9 ? '9+' : unread}
                      </span>
                    )}
                  </button>
                  {showNotifs && (
                    <NotificationPanel
                      notifications={notifications}
                      onMarkRead={markRead}
                      onMarkAllRead={markAllRead}
                      onDismiss={dismiss}
                      onNavigate={handleNotifNavigate}
                      onClose={() => setShowNotifs(false)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-2 bg-[#F7F9FB] dark:bg-[#111315] transition-colors duration-300">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
