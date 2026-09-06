import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DB } from '../services/dbStore.js';
import { validateEmail, validatePassword } from '../utils/validation.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'preptrack_jwt_super_secret_key_2026';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    const existingUser = await DB.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await DB.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      targetRole: 'Software Engineer',
      skills: ['JavaScript', 'React', 'Node.js', 'DSA'],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        skills: user.skills,
        github: user.github || '',
        linkedin: user.linkedin || '',
        leetcode: user.leetcode || '',
        portfolio: user.portfolio || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await DB.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        skills: user.skills,
        github: user.github || '',
        linkedin: user.linkedin || '',
        leetcode: user.leetcode || '',
        portfolio: user.portfolio || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await DB.findUserById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        skills: user.skills,
        github: user.github || '',
        linkedin: user.linkedin || '',
        leetcode: user.leetcode || '',
        portfolio: user.portfolio || '',
      },
    });
  } catch (error) {
    next(error);
  }
};
