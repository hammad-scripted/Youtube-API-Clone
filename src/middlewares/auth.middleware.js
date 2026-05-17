import { verifyToken } from '../lib/utils.js';
export const protectRoute = (req, res, next) => {
  try {
    const authBearer = req.headers.authorization;
    if (!authBearer || !authBearer.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, message: 'Token not found' });
    }

    const token = authBearer.split(' ')[1];
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.user = decodedToken;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: 'User not authenticated' });
  }
  next();
};
