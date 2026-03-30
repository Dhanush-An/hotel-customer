import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import SubAdminOverview from '../components/subadmin/SubAdminOverview';
import SnacksTab from '../components/subadmin/SnacksTab';
import RoomManagement from '../components/admin/RoomManagement';
import BookingManagement from '../components/admin/BookingManagement';
import AvailableRooms from '../components/admin/AvailableRooms';
import ExpensesTab from '../components/admin/ExpensesTab';
import { LayoutDashboard, BedDouble, CalendarCheck, ListPlus, Receipt, Coffee } from 'lucide-react';

const SubAdminTabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'rooms', label: 'Room Management', icon: BedDouble },
  { id: 'bookings', label: 'Booking Management', icon: CalendarCheck },
  { id: 'available', label: 'Available Rooms', icon: ListPlus },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'snacks', label: 'Snacks', icon: Coffee },
];

const SubAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const contentMap = {
    overview: <SubAdminOverview />,
    rooms: <RoomManagement />,
    bookings: <BookingManagement />,
    available: <AvailableRooms />,
    expenses: <ExpensesTab />,
    snacks: <SnacksTab />,
  };

  return (
    <DashboardLayout 
      role="subadmin" 
      title={SubAdminTabs.find(t => t.id === activeTab)?.label || 'Sub-Admin Portal'}
      menuItems={SubAdminTabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {contentMap[activeTab]}
    </DashboardLayout>
  );
};

export default SubAdminDashboard;
