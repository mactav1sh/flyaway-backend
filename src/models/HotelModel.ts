import mongoose from 'mongoose';

interface IHotel {
  name: string;
  type: string;
  city: string;
  address: string;
  distance: string;
  photos?: [string];
  title: string;
  desc: string;
  rating?: number;
  rooms?: [string];
  cheapestPrice: number;
  featured: boolean;
}

const hotelSchema = new mongoose.Schema<IHotel>({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
  },
  city: { type: String, required: true },
  address: { type: String, required: true },
  distance: { type: String, required: true },
  photos: { type: [String] },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5 },
  rooms: { type: [String] },
  cheapestPrice: { type: Number, required: true },
  featured: { type: Boolean, default: false },
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
