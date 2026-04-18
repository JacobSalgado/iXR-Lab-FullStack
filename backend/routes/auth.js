const express = require('express');
const jwt = require ('jsonwebtoken');
const User = require ('../models/User');
const router = express.Router();

// REGISTER info
router.post('/register', async (req, res) => {
	try {
		const {firstName, lastName, email, password, role} = req.body;
		
		// check if user already exists
		const existing = await User.findOne({email});
		if (existing) {
			return res.status(400).json({message: 'Email already registered'});
		}

		// create user - password hasing happens automatically
		const user = await User.create({firstName, lastName, email, password, role});
		
		const token = jwt.sign(
			{id: user._id, role: user.role},
			process.env.JWT_SECRET,
			{expiresIn: process.env.JWT_EXPIRES_IN}
		);
		
		res.status(201).json({
			message: 'Account created successfully',
			token,
			user: {id: user._id, firstName, lastName, email, role: user.role}
});
	} catch (err) {
		res.status(500).json({message: 'Server error', error: err.message});
	}
});

// login info
router.post('/login', async(req, res) => {
	try {
		const {email, password} = req.body;

		// find user - mongoose parameterized query, safe from NoSQL injection
		const user = await User.findOne({email: String(email)});
		if (!user) {
			return res.status(401).json({message: 'Invalid email or password'});
		}
		
		// compares password using bycrypt
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({message:'Invalid email or password'});
		}
		const token = jwt.sign(
			{id: user._id, role: user.role},
			process.env.JWT_SECRET,
			{expiresIn: process.env.JWT_EXPIRES_IN}
		);

		res.status(200).json({
			message: 'Login successful',
			token,
			user: {id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role}
		});
	} catch (err) {
	res.status(500).json({message: 'Server error', error: err.message});
	}
});

module.exports = router;
