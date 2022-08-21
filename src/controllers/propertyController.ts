import Property, { IProperty } from '../models/PropertyModel';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { Query } from 'mongoose';

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let query;
    const { minPrice, maxPrice, location, limit, ...reqObject } = req.query;

    // TODO: REFACTOR FILTERING
    // Filtering based on location (either a city or country)
    if (location)
      query = Property.find({
        $or: [{ city: req.query.location }, { country: req.query.location }],
        ...reqObject,
      });
    else {
      query = Property.find(reqObject);
    }

    // Max and min price
    if (minPrice || maxPrice) {
      query = query.find({
        price: {
          $gte: req.query.minPrice || 100,
          $lte: req.query.maxPrice || 100000000,
        },
      });
    }

    // Limit
    if (limit) {
      query.limit(+limit);
    }

    const properties = await query.sort({ createdAt: -1 });

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

// DELETE
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

// COUNT BY PROPERTY TYPES
export const getPropertiesCountByTypes = async (
  _req: Request,
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
      {
        $sort: { _id: -1 },
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

// COUNT BY CITIES
export const getPropertiesCountByCities = async (
  _req: Request,
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
