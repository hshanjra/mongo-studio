import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  handle: string;
  sale_price: number;
  regular_price: number;
  short_description?: string;
  long_description?: string;
  images?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
  sale_price: {
    type: Number,
    required: true,
  },
  regular_price: {
    type: Number,
    required: true,
  },
  short_description: {
    type: String,
  },
  long_description: {
    type: String,
  },
  images: {
    type: Array,
  },
}, {
  timestamps: true
});

const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
export default ProductModel;
