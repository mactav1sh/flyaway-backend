import mongoose from 'mongoose';

interface IProperty {
  name: string;
  type: string;
  country: string;
  city: string;
  address: string;
  distance: string;
  photos?: string[];
  title: string;
  desc: string;
  rating?: number;
  rooms?: string[];
  cheapestPrice: number;
  featured: boolean;
}

const propertySchema = new mongoose.Schema<IProperty>({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
  },
  country: { type: String, required: true },
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

const Property = mongoose.model('Property', propertySchema);

export default Property;
