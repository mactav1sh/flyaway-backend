import Hotel from '../models/HotelModel';
import { Request, Response, NextFunction } from 'express';

// Create
export const createHotel = async (
  req: Request,
  res: Response,
  _next: NextFunction
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
    console.log(error);
  }
};

// READ
export const getHotels = async (
  _req: Request,
  res: Response,
  _next: NextFunction
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
    console.log(error);
  }
};

export const getHotel = async (
  req: Request,
  res: Response,
  _next: NextFunction
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
    console.log(error);
  }
};

// UPDATE
export const updateHotel = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        updatedHotel,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// Delete
export const deleteHotel = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    console.log(error);
  }
};
