import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
		lowercase: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email',
		},
	},
	role: {
		type: String,
		enum: ['user', 'admin'],
		default: 'user',
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: [8, 'Password must be at least 8 characters'],
		select: false,
	},
	photo: String,
	pwdChangedAt: {
		type: Date,
		select: false,
	},
	tempToken: String,
	tempTokenExp: Date,
});

userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 12);
		this.pwdChangedAt = Date.now();
	}
	next();
});

userSchema.methods.isCorrectPwd = async (pwd, hash) => {
	return await bcrypt.compare(pwd, hash);
};

export default mongoose.model('User', userSchema);
