import mongoose from 'mongoose';

export interface IProperty {
  name: string;
  type: string;
  country: string;
  city: string;
  address: string;
  distance: number;
  photos?: string[];
  shortDesc: string;
  desc: string;
  rating?: number;
  rooms?: string[];
  interior: string;
  price: number;
  featured: boolean;
}

const propertySchema = new mongoose.Schema<IProperty>({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['apartments', 'hotels', 'hostels', 'villas', 'cabins', 'resorts'],
  },
  country: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  distance: { type: Number, required: true },
  photos: { type: [String] },
  desc: { type: String, required: true },
  shortDesc: { type: String, required: true },
  rating: { type: Number, min: 0, max: 10, default: 5 },
  rooms: { type: [String] },
  interior: { type: String, required: true },
  price: { type: Number, required: true },
  featured: { type: Boolean, default: false },
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
