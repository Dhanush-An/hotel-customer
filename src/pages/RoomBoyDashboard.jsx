import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import RoomBoyOverview from '../components/roomboy/RoomBoyOverview';
import RoomStatusTab from '../components/roomboy/RoomStatusTab';
import RoomBoyAttendance from '../components/roomboy/RoomBoyAttendance';
import { 
  LayoutDashboard, Bed, UserCheck, Bell, 
  Clock, ClipboardList, CheckSquare 
} from 'lucide-react';

const RoomBoyTabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'status', label: 'Room Cleanup', icon: Bed },
  { id: 'tasks', label: 'Assigned Tasks', icon: ClipboardList },
  { id: 'attendance', label: 'Attendance', icon: UserCheck },
  { id: 'alerts', label: 'Urgent Alerts', icon: Bell },
];

export default function RoomBoyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const contentMap = {
    overview: <RoomBoyOverview />,
    status: <RoomStatusTab />,
    tasks: (
      <div className="bg-white dark:bg-[#1c1c24] p-12 rounded-[40px] border-4 border-dashed border-gray-100 dark:border-[#2a2a35] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
         <div className="w-24 h-24 bg-primary-100 text-primary-500 rounded-3xl flex items-center justify-center mb-6">
            <CheckSquare size={48} />
         </div>
         <h3 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter mb-2">Task Board</h3>
         <p className="text-gray-400 font-bold max-w-xs uppercase text-[10px] tracking-widest leading-loose">Check back later for personalized floor tasks assigned by housekeeping manager.</p>
      </div>
    ),
    attendance: <RoomBoyAttendance />,
    alerts: (
      <div className="bg-white dark:bg-[#1c1c24] p-12 rounded-[40px] border-4 border-dashed border-gray-100 dark:border-[#2a2a35] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
         <div className="w-24 h-24 bg-red-100 text-red-500 rounded-3xl flex items-center justify-center mb-6">
            <Bell size={48} />
         </div>
         <h3 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter mb-2">No Alerts</h3>
         <p className="text-gray-400 font-bold max-w-xs uppercase text-[10px] tracking-widest leading-loose">Everything is running smoothly on your floor. Great job!</p>
      </div>
    ),
  };

  return (
    <DashboardLayout
      role="roomboy"
      title={RoomBoyTabs.find(t => t.id === activeTab)?.label || 'Staff Portal'}
      menuItems={RoomBoyTabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <div className="max-w-7xl mx-auto">
         {contentMap[activeTab]}
      </div>
    </DashboardLayout>
  );
}
