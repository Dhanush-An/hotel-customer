import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import ReceptionistOverview from '../components/receptionist/ReceptionistOverview';
import BookingManagement from '../components/admin/BookingManagement';
import CheckInTab from '../components/receptionist/CheckInTab';
import CheckOutTab from '../components/receptionist/CheckOutTab';
import PaymentTab from '../components/admin/PaymentTab';
import AvailableRooms from '../components/admin/AvailableRooms';
import ReceptionistAttendance from '../components/receptionist/ReceptionistAttendance';
import { LayoutDashboard, CalendarCheck, UserCheck, LogOut, CreditCard, ClipboardCheck, MessageCircle, Megaphone, ListPlus } from 'lucide-react';

const ReceptionistTabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Booking Management', icon: CalendarCheck },
  { id: 'checkin', label: 'Check In', icon: UserCheck },
  { id: 'checkout', label: 'Check Out', icon: LogOut },
  { id: 'available', label: 'Available Rooms', icon: ListPlus },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'attendance', label: 'Attendance Monitoring', icon: ClipboardCheck },
  { id: 'queries', label: 'Queries', icon: MessageCircle },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
];

const ReceptionistDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const contentMap = {
    overview: <ReceptionistOverview />,
    bookings: <BookingManagement />,
    checkin: <CheckInTab />,
    checkout: <CheckOutTab />,
    available: <AvailableRooms />,
    payments: <PaymentTab />,
    attendance: <ReceptionistAttendance />,
    queries: <div className="p-8 text-center text-gray-500 uppercase tracking-widest text-[10px] font-black opacity-20">Queries Module · Secured</div>,
    announcements: <div className="p-8 text-center text-gray-500 uppercase tracking-widest text-[10px] font-black opacity-20">Announcements · Secured</div>,
  };

  return (
    <DashboardLayout 
      role="receptionist" 
      title={ReceptionistTabs.find(t => t.id === activeTab)?.label || 'Reception Portal'}
      menuItems={ReceptionistTabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      <div className="animate-fade-in transition-all">
        {contentMap[activeTab]}
      </div>
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;

