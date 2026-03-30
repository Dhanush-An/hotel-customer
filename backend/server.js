const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

app.use(cors({
  origin: true, // Dynamically allow any origin (perfect for local development)
  credentials: true,
}));
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "HOTEL GLITZ SUITES API is running"
  });
});

// Basic API check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is fully separated and running!' });
});

// Import and use routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 11000;
app.listen(PORT, () => {
  console.log(`\x1b[32m✔ SUCCESS:\x1b[0m Customer API is live and separated on port ${PORT}`);
  console.log(`\x1b[36mℹ INFO:\x1b[0m Backend is ready for online bookings at http://localhost:${PORT}/api`);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('\x1b[31m✘ SERVER ERROR:\x1b[0m', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});
