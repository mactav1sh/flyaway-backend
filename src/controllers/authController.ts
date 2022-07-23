import { NextFunction, Request, Response, CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';
import AppError from '../utils/AppError';
import { IUser } from '../models/UserModel';

/*******************************************************/
// HELPER FUNCTIONS
/*******************************************************/
interface IJWTPayload extends jwt.JwtPayload {
  id?: string;
}

const createAndSendToken = (user: IUser, res: Response, statusCode: number) => {
  // 2.create and send token in a cookie
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
  // - sending jwt in a cookie
  const cookieOpts: CookieOptions = {
    httpOnly: true,
  };
  // - secure	-	Marks the cookie to be used with HTTPS only.
  if (process.env.ENV === 'production') cookieOpts.secure = true;
  res.cookie('access_token', token, cookieOpts);
  // removie password from data
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
  });
};

/*******************************************************/
// CONTROLLERS
/*******************************************************/
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. create user
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.password,
      // TODO: REMOVE ROLE AFTER FINISHING DEVELOPMENT
      role: req.body.role,
    });
    createAndSendToken(newUser, res, 201);
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new AppError(404, 'please provide the required credentials'));

    // 1. find user
    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return next(new AppError(404, 'please provide the correct credentials'));
    // 2. compare passwords
    const isAuthenticated = await user.comparePasswords(
      password,
      user.password
    );
    if (!isAuthenticated)
      return next(new AppError(404, 'please provide the correct credentials'));

    createAndSendToken(user, res, 200);
  } catch (error) {
    next(error);
  }
};

// Update password
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.params.id !== req.user?.id) {
      return next(
        new AppError(403, 'you are not allowed to  perform this action')
      );
    }
    const { password, passwordConfirm } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError(404, 'Invalid request make sure token is not expired');
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();
    createAndSendToken(user, res, 200);
  } catch (error) {
    next(error);
  }
};

// PROTECT ROUTE
export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return next(new AppError(401, 'please log in to gain access'));

    await jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      function (err: any, decoded: any) {
        if (err) {
          return new AppError(401, 'you are not authorized to gain access');
        } else {
          User.findById(decoded.id).then((currentUser) => {
            if (!currentUser)
              return next(new AppError(404, 'user is not found'));
            req.user = currentUser;
            next();
          });
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

// RESTRICT ROUTE
export const restrictRoute =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    // TODO: maybe ?
    // if admin allow any action
    // if user only allow if req.param.id === user.id
    if (roles.includes(req.user?.role as string)) {
      next();
    } else {
      next(new AppError(403, 'you are not authorized to perform this action'));
    }
  };

// const verifyToken = <T>(token: string, secret: Secret): Promise<T> => {
// 	return new Promise((resolve, reject) => {
// 		jwt.verify(token, secret, (err, decode) => {
// 			if (!err) {
// 				resolve(decode as T);
// 			} else {
// 				reject(err);
// 			}
// 		});
// 	});
// }
