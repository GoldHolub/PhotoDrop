import { Request, Response, NextFunction } from 'express';

export const roleCheck = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user as { role: string };
  
      if (roles.includes(user.role)) {
        return next();
      }
  
      return res.status(403).json({ message: 'Forbidden: You do not have the necessary role' });
    };
  };