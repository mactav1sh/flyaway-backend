import Property from '../models/PropertyModel';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

// Create
export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const property = await Property.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        property,
      },
    });
  } catch (error) {
    next(error);
  }
};

// READ
export const getProperties = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const properties = await Property.find();
    res.status(200).json({
      status: 'success',
      length: properties.length,
      data: {
        properties,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property)
      return next(new AppError(404, "there's no Property with this id"));

    res.status(200).json({
      status: 'success',
      data: {
        property,
      },
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE
export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        updatedProperty,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete
export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};

// count by types
export const getPropertiesCountByTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const properties = await Property.aggregate([
      {
        $group: {
          _id: '$type',
          count: {
            // Every tour passes will add one
            $sum: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        properties,
      },
    });
  } catch (error) {
    next(error);
  }
};

// count by cities

export const getPropertiesCountByCities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const properties = await Property.aggregate([
      {
        $group: {
          _id: '$city',
          count: {
            // Every tour passes will add one
            $sum: 1,
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        properties,
      },
    });
  } catch (error) {
    next(error);
  }
};
