import express from 'express';
import * as propertyController from '../controllers/propertyController';
import * as authController from '../controllers/authController';

const router = express.Router();

// Special routes
router.get('/types-count', propertyController.getPropertiesCountByTypes);
router.get('/cities-count', propertyController.getPropertiesCountByCities);

// Normal routes
// CREATE
router.post(
  '/',
  authController.protectRoute,
  authController.restrictRoute('admin'),
  propertyController.createProperty
);
// READ
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getProperty);
// UPDATE
router.patch(
  '/:id',
  authController.protectRoute,
  authController.restrictRoute('admin'),
  propertyController.updateProperty
);
// DELETE
router.delete(
  '/:id',
  authController.protectRoute,
  authController.restrictRoute('admin'),
  propertyController.deleteProperty
);

export default router;
