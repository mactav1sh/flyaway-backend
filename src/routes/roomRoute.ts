import express from 'express';
import * as roomController from '../controllers/roomController';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post(
  '/:propertyId',
  authController.protectRoute,
  authController.restrictRoute('admin'),
  roomController.createRoom
);

router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoom);
router.get('/property/:propertyId', roomController.getPropertyRooms);

router.patch('/:id', roomController.updateRoom);

router.delete(
  '/:id/:propertyId',
  authController.protectRoute,
  authController.restrictRoute('admin'),
  roomController.deleteRoom
);

export default router;
