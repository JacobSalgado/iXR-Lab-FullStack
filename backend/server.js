require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');

const app express();

// security middleware
app.use(helmet()); // sets secure HTTP headers automatically

app.use(cors({
	origin: 'http://192.168.184.130', // only frontend VM
	credentials: true
}));

// rate limit -  10 max login attempts per 15 minutes per IP
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	message: {message: 'Too many attempts, please try again later'}
});
app.use('/api/auth', limiter);

app.use(express.json()); // parse JSON bodies

// ROUTES
app.use('/api/auth', authRoutes);

// connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
	.then(() => {
		console.log('Connected to MongoDB');
		app.listen(process.env.PORT, () => {
			console.log('Server running on port ${process.env.PORT}');
		});
	})
	.catch (err => {
		console.error('MongoDB connection failed:', err.message);
		process.exit(1);
	});
