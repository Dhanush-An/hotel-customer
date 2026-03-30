const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

const api = {
  // Auth
  login: (data) => fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  register: (data) => fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),

  // Rooms
  getRooms: () => fetch(`${API_BASE}/rooms`).then(handleResponse),
  createRoom: (data) => fetch(`${API_BASE}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  updateRoom: (id, data) => fetch(`${API_BASE}/rooms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  deleteRoom: (id) => fetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Bookings
  getBookings: () => fetch(`${API_BASE}/bookings`).then(handleResponse),
  createBooking: (data) => fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  updateBooking: (id, data) => fetch(`${API_BASE}/bookings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  deleteBooking: (id) => fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Staff
  getStaff: () => fetch(`${API_BASE}/staff`).then(handleResponse),
  createStaff: (data) => fetch(`${API_BASE}/staff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  updateStaff: (id, data) => fetch(`${API_BASE}/staff/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  deleteStaff: (id) => fetch(`${API_BASE}/staff/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Expenses
  getExpenses: () => fetch(`${API_BASE}/expenses`).then(handleResponse),
  createExpense: (data) => fetch(`${API_BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  updateExpense: (id, data) => fetch(`${API_BASE}/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  deleteExpense: (id) => fetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Attendance
  getAttendance: () => fetch(`${API_BASE}/attendance`).then(handleResponse),
  createAttendance: (data) => fetch(`${API_BASE}/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  updateAttendance: (id, data) => fetch(`${API_BASE}/attendance/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),

  // Tasks
  getTasks: () => fetch(`${API_BASE}/tasks`).then(handleResponse),
  createTask: (data) => fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  updateTask: (id, data) => fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  deleteTask: (id) => fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' }).then(handleResponse),

  // Payments
  getPayments: () => fetch(`${API_BASE}/payments`).then(handleResponse),
  createPayment: (data) => fetch(`${API_BASE}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  updatePayment: (id, data) => fetch(`${API_BASE}/payments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  deletePayment: (id) => fetch(`${API_BASE}/payments/${id}`, { method: 'DELETE' }).then(handleResponse),
};

// Also export individual named exports for backward compatibility with customer dashboard
export const getRooms = api.getRooms;
export const getBookings = api.getBookings;
export const createBooking = api.createBooking;
export const updateBooking = api.updateBooking;
export const getAvailableRooms = async () => {
    const rooms = await api.getRooms();
    return rooms.filter(r => {
      const s = r.status?.toLowerCase() || '';
      return !s || s === 'available' || s === 'ready' || s === 'free' || s === 'vacant';
    });
};

export default api;
