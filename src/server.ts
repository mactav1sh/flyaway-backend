import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const db = process.env.DATABASE_LOCAL as string;

mongoose.connect(db).then(() => {
  console.log('database connected');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('started');
});
