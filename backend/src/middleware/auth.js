import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } 
  // Check header as fallback (for testing/mobile)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    res.status(401);
    const err = new Error('Not authorized to access this route');
    return next(err);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
        res.status(401);
        return next(new Error('User not found'));
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401);
    const error = new Error('Not authorized to access this route');
    return next(error);
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
       res.status(403);
       const err = new Error(`User role ${req.user.role} is not authorized to access this route`);
       return next(err);
    }
    next();
  };
};
