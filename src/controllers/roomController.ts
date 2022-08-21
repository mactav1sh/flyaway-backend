import Room from '../models/RoomModel';
import Property from '../models/PropertyModel';
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
    const property = await Property.findByIdAndUpdate(
      req.params.propertyId,
      {
        $push: { rooms: room._id },
      },
      { runValidators: true, new: true }
    );
    if (!property)
      return next(new AppError(404, "there's no Property with this id"));

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
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { ...req.body, $push: { unavailableDates: req.body.dates } },
      {
        new: true,
      }
    );
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
    const property = await Property.findByIdAndUpdate(
      req.params.propertyId,
      {
        $pull: { rooms: roomId },
      },
      { runValidators: true, new: true }
    );

    if (!property)
      return next(new AppError(404, "there's no hotel with this id"));

    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};

// GET A PROPERTY'S ROOMS
export const getPropertyRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Get property
    const property = await Property.findById(req.params.propertyId, 'rooms');
    // 2) Create an array of promises containing each room
    const roomPromises = property?.rooms?.map((roomId) =>
      Room.findById(roomId)
    ) as [];
    // 3) Await promises
    const roomsData = await Promise.all(roomPromises);

    res.status(200).json({
      status: 'success',
      length: roomsData.length,
      data: {
        rooms: roomsData,
      },
    });
  } catch (error) {
    next(error);
  }
};
