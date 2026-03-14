import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['patient', 'doctor', 'admin'] },
  name: { type: String, required: true },
  avatar: { type: String },
  badge: { type: String },
}, { timestamps: true });

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  // If the stored password isn't hashed yet (seeded plainly), compare directly too
  if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
    return enteredPassword === this.password;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  if (!this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

export default mongoose.model('User', userSchema);
