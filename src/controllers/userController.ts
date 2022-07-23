import User from '../models/UserModel';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

interface iUpdatesObj {
  name: string;
  role?: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

// READ
export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      length: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return next(
        new AppError(404, `there is no document with id:${req.params.id} `)
      );

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateUser = async (
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

    if (req.body.password || req.body.passwordConfirm) {
      throw new AppError(
        400,
        'you cannot change password from this route, please use /update-password'
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, email: req.body.email },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateUser)
      return next(
        new AppError(404, `there is no document with id:${req.params.id} `)
      );

    res.status(200).json({
      status: 'success',
      data: {
        updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: REFACTOR
    if (req.params.id !== req.user?.id) {
      return next(
        new AppError(403, 'you are not allowed to  perform this action')
      );
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};
