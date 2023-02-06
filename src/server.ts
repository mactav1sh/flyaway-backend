import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const db = process.env.DATABASE_URL as string;

mongoose.connect(db).then(() => {
  console.log('database connected');
  app.listen(port, () => {
    console.log('server started');
  });
});

const port = process.env.PORT || 5000;
