import express from 'express';
import * as hotelController from '../controllers/hotelController';

const router = express.Router();

router.post('/', hotelController.createHotel);
router.get('/', hotelController.getHotels);
router.get('/:id', hotelController.getHotel);
router.patch('/:id', hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

export default router;
