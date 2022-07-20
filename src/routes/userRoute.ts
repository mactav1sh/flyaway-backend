import express from 'express';
import * as authController from '../controllers/authController';
import User from '../models/UserModel';
const router = express.Router();

router.get('/', authController.protectRoute, async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
      user: req.user,
    },
  });
});

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);

export default router;
