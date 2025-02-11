import mongoose, { Schema, Document } from 'mongoose';

// Define the interface
interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  category: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'clothing', 'food', 'books']
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create and export the model
const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
