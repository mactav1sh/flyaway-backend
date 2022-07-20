import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';

function wrongRouteHandler(req: Request, _res: Response, next: NextFunction) {
  const err = new AppError(
    404,
    `route (${req.originalUrl}) doesn't exist on this server`
  );
  next(err);
}

export default wrongRouteHandler;
