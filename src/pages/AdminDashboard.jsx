import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Overview from '../components/Overview';
import RoomManagement from '../components/admin/RoomManagement';
import StaffManagement from '../components/admin/StaffManagement';
import BookingManagement from '../components/admin/BookingManagement';
import AvailableRooms from '../components/admin/AvailableRooms';
import ExpensesTab from '../components/admin/ExpensesTab';
import PaymentTab from '../components/admin/PaymentTab';
import RevenueTab from '../components/admin/RevenueTab';
import SalaryManagement from '../components/admin/SalaryManagement';
import SettingsTab from '../components/admin/SettingsTab';
import AttendanceTab from '../components/admin/AttendanceTab';
import TaskTab from '../components/admin/TaskTab';
import QueriesTab from '../components/admin/QueriesTab';
import { 
  LayoutDashboard, BedDouble, Users, CalendarCheck, 
  DoorOpen, Receipt, CreditCard, TrendingUp, 
  Banknote, Settings, UserCheck, CheckSquare, MessageCircle 
} from 'lucide-react';

const AdminTabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'rooms', label: 'Room Management', icon: BedDouble },
  { id: 'staff', label: 'Staff Management', icon: Users },
  { id: 'bookings', label: 'Booking Management', icon: CalendarCheck },
  { id: 'available', label: 'Available Room', icon: DoorOpen },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'revenue', label: 'Revenue', icon: TrendingUp },
  { id: 'salary', label: 'Salary Management', icon: Banknote },
  { id: 'attendance', label: 'Attendance', icon: UserCheck },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'queries', label: 'Queries', icon: MessageCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const contentMap = {
    overview: <Overview />,
    rooms: <RoomManagement />,
    staff: <StaffManagement />,
    bookings: <BookingManagement />,
    available: <AvailableRooms />,
    expenses: <ExpensesTab />,
    payment: <PaymentTab />,
    revenue: <RevenueTab />,
    salary: <SalaryManagement />,
    attendance: <AttendanceTab />,
    tasks: <TaskTab />,
    queries: <QueriesTab />,
    settings: <SettingsTab />,
  };

  return (
    <DashboardLayout
      role="admin"
      title={AdminTabs.find(t => t.id === activeTab)?.label || 'Admin Portal'}
      menuItems={AdminTabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {contentMap[activeTab]}
    </DashboardLayout>
  );
}
