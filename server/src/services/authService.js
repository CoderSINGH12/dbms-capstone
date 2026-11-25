import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { ENV } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const authService = {
  async login(email, password) {
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!rows || rows.length === 0) {
      throw new AppError('Invalid credentials. Please verify email and password.', 401);
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid credentials. Please verify email and password.', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT.SECRET,
      { expiresIn: ENV.JWT.EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  async getMe(userId) {
    const [rows] = await pool.query('SELECT id, email, name, role, created_at FROM users WHERE id = ?', [userId]);
    if (!rows || rows.length === 0) {
      throw new AppError('User not found', 404);
    }
    return rows[0];
  },
};
