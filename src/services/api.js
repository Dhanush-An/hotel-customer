const BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

const req = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
};

// ── Rooms ──────────────────────────────────────────────────────────
export const getRooms = () => req('/rooms');
export const getAvailableRooms = async () => {
  const rooms = await req('/rooms');
  return rooms.filter(r => {
    const s = r.status?.toLowerCase() || '';
    return !s || s === 'available' || s === 'ready' || s === 'free' || s === 'vacant';
  });
};
export const updateRoomStatus = (id, status) =>
  req(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });

// ── Bookings ───────────────────────────────────────────────────────
export const getBookings = () => req('/bookings');
export const createBooking = (data) =>
  req('/bookings', { method: 'POST', body: JSON.stringify(data) });
export const updateBooking = (id, data) =>
  req(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) });
