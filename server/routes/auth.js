import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const DEMO_USERS = [
  { id: 'P-001', password: 'patient123', role: 'patient', name: 'John Doe', avatar: 'JD', badge: 'Patient ID' },
  { id: 'P-002', password: 'patient456', role: 'patient', name: 'Priya Sharma', avatar: 'PS', badge: 'Patient ID' },
  { id: 'P-003', password: 'pass123',    role: 'patient', name: 'Rohan Mehta', avatar: 'RM', badge: 'Patient ID' },
  { id: 'D-001', password: 'doctor123',  role: 'doctor',  name: 'Dr. Ramesh Sharma', avatar: 'RS', badge: 'Doctor ID' },
  { id: 'D-002', password: 'doctor456',  role: 'doctor',  name: 'Dr. Anita Rao', avatar: 'AR', badge: 'Doctor ID' },
  { id: 'A-001', password: 'admin123',   role: 'admin',   name: 'Health Admin', avatar: 'HA', badge: 'Admin ID' },
];

router.post('/login', async (req, res) => {
  try {
    const { userId, password, selectedRole } = req.body;
    
    // Normalize string so p-001 matches P-001
    const idToSearch = userId.trim().toUpperCase();

    // if no users exist, seed them automatically
    const count = await User.countDocuments();
    if (count === 0) {
      await User.insertMany(DEMO_USERS);
      console.log('Seeded demo users automatically');
    }

    const user = await User.findOne({ id: idToSearch, role: selectedRole });
    
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET || 'MEDISIGHT_SECRET_KEY_123', 
        { expiresIn: '30d' }
      );
      
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          badge: user.badge,
          token
        }
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials. Please check your ID, password, and selected role.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { userId, password, name, selectedRole } = req.body;
    
    if (!userId || !password || !name || !selectedRole) {
      return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }

    const idToSearch = userId.trim().toUpperCase();

    const userExists = await User.findOne({ id: idToSearch, role: selectedRole });

    if (userExists) {
      return res.status(400).json({ success: false, error: 'User ID already exists for this role' });
    }

    const getInitials = (name) => {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const badgeMap = {
      patient: 'Patient ID',
      doctor: 'Doctor ID',
      admin: 'Admin ID'
    };

    const user = await User.create({
      id: idToSearch,
      password,
      name,
      role: selectedRole,
      avatar: getInitials(name),
      badge: badgeMap[selectedRole]
    });

    if (user) {
      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET || 'MEDISIGHT_SECRET_KEY_123', 
        { expiresIn: '30d' }
      );

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          badge: user.badge,
          token
        }
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
