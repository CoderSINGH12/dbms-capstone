import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { pool } from '../config/db.js';

export const verifyToken = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication required. Please provide a Bearer token.', 401));
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT.SECRET);
    
    // Check if user still exists in DB
    const [rows] = await pool.query('SELECT id, email, name, role FROM users WHERE id = ?', [decoded.id]);
    if (!rows || rows.length === 0) {
      return next(new AppError('The user account associated with this token no longer exists.', 401));
    }

    req.user = rows[0];
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'editor')) {
    return next(new AppError('Access forbidden: This action requires Administrator privileges.', 403));
  }
  next();
};
