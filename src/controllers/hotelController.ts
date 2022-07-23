import Hotel from '../models/HotelModel';
import { Request, Response, NextFunction } from 'express';

// Create
export const createHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        hotel,
      },
    });
  } catch (error) {
    next(error);
  }
};

// READ
export const getHotels = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotels = await Hotel.find();

    res.status(200).json({
      status: 'success',
      length: hotels.length,
      data: {
        hotels,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        hotel,
      },
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        updatedHotel,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete
export const deleteHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};
