import { IUser } from '../models/UserModel';
export {};

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
