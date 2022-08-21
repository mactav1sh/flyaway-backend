import mongoose from 'mongoose';

interface IRoom {
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  unavailableDates: [Date];
}

const roomSchema = new mongoose.Schema<IRoom>(
  {
    title: { type: String, required: true },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: { type: Number, required: true },
    desc: { type: String, required: true },
    unavailableDates: { type: [Date], required: true },
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
