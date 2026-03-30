import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import HousekeepingAttendance from '../components/housekeeping/HousekeepingAttendance';
import HousekeepingOverview from '../components/housekeeping/HousekeepingOverview';
import RoomCleanupTab from '../components/housekeeping/RoomCleanupTab';
import { LayoutDashboard, BedDouble, UserCheck, Bell } from 'lucide-react';

const HousekeepingTabs = [
  { id: 'overview',  label: 'Overview',      icon: LayoutDashboard },
  { id: 'cleanup',   label: 'Room Cleanup',   icon: BedDouble },
  { id: 'attendance',label: 'Attendance',     icon: UserCheck },
  { id: 'alerts',    label: 'Urgent Alerts',  icon: Bell },
];

const HousekeepingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const contentMap = {
    overview:   <HousekeepingOverview />,
    cleanup:    <RoomCleanupTab />,
    attendance: <HousekeepingAttendance />,
    alerts:     (
      <div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-xs opacity-50">
        Urgent Alerts · Secured
      </div>
    ),
  };

  return (
    <DashboardLayout
      role="housekeeping"
      title={HousekeepingTabs.find(t => t.id === activeTab)?.label || 'Housekeeping Portal'}
      menuItems={HousekeepingTabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <div className="animate-fade-in transition-all">
        {contentMap[activeTab]}
      </div>
    </DashboardLayout>
  );
};

export default HousekeepingDashboard;
