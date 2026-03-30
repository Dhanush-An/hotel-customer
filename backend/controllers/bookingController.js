const Booking = require('../models/Booking');
const Room = require('../models/Room');

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    // If booking is created immediately as Confirmed, mark room as Booked
    if (booking.status === 'Confirmed') {
      await Room.findOneAndUpdate({ roomNumber: booking.room }, { status: 'Booked' });
    }
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Approval Flow Handle: If receptionist sets to Confirmed, lock the room
    if (booking.status === 'Confirmed') {
      await Room.findOneAndUpdate({ roomNumber: booking.room }, { status: 'Booked' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (booking) {
      // Free the room if the booking was confirmed but now being deleted
      await Room.findOneAndUpdate({ roomNumber: booking.room }, { status: 'Available' });
      await Booking.findByIdAndDelete(req.params.id);
    }
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBookings, createBooking, updateBooking, deleteBooking };
