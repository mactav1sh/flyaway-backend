import express from 'express';
import * as hotelController from '../controllers/hotelController';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post(
  '/',
  authController.protectRoute,
  authController.restrictRoute('admin'),
  hotelController.createHotel
);

router.get('/', hotelController.getHotels);
router.get('/:id', hotelController.getHotel);

router.patch(
  '/:id',
  authController.protectRoute,
  authController.restrictRoute('admin'),
  hotelController.updateHotel
);

router.delete(
  '/:id',
  authController.protectRoute,
  authController.restrictRoute('admin'),
  hotelController.deleteHotel
);

export default router;
