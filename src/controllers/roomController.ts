import Room from '../models/RoomModel';
import Hotel from '../models/HotelModel';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

// Create
export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // create new room
    const room = await Room.create(req.body);
    // add new room.id to the rooms array inside hotel model
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.hotelId,
      {
        $push: { rooms: room._id },
      },
      { runValidators: true, new: true }
    );
    if (!hotel) return next(new AppError(404, "there's no hotel with this id"));

    res.status(200).json({
      status: 'success',
      data: {
        room,
      },
    });
  } catch (error) {
    next(error);
  }
};

// READ
export const getRooms = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const rooms = await Room.find();

    res.status(200).json({
      status: 'success',
      length: rooms.length,
      data: {
        rooms,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const room = await Room.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        room,
      },
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        updatedRoom,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete
export const deleteRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roomId = req.params.id;
    // delete room
    await Room.findByIdAndDelete(req.params.id);

    // delete room.id from the rooms array inside hotel
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.hotelId,
      {
        $pull: { rooms: roomId },
      },
      { runValidators: true, new: true }
    );

    if (!hotel) return next(new AppError(404, "there's no hotel with this id"));

    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};
