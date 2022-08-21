import express from 'express';
import * as authController from '../controllers/authController';
import * as userController from '../controllers/userController';

import User from '../models/UserModel';
const router = express.Router();

router.get('/sign-out', userController.signOut);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', authController.protectRoute, userController.updateUser);

router.patch(
  '/update-password/:id',
  authController.protectRoute,
  authController.updatePassword
);

router.delete('/:id', authController.protectRoute, userController.deleteUser);

// Authentication
router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);

export default router;
