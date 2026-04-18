const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	firstName: {type: String, required: true, trim: true},
	lastName: {type: String, required: true, trim: true},
	email: {type: String, required: true, unique: true,
		lowercase: true, trim: true},
	password: {type: String, required: true, minLength: 8},
	role: {type: String, enum: ['admin', 'researcher', 'viewer'],
		default: 'viewer'}
	createdAt: {type: Date, default: Date.now}
});

// hash password before saving
userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) return next(); // only has if changed
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

// method to compare passwords on login
userSchema.methods.comparePassword = async function(candidate) {
	return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
