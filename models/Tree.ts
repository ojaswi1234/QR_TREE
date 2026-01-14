import mongoose, { Schema, Model } from 'mongoose';

export interface ITree {
  tree_id: number;
  common_name: string;
  scientific_name: string;
  description: string;
  benefits: string[];
  images: string[];
  age: number;
  planted_date: string;
  health_status: string;
  planted_by: string;
  qr_code?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TreeSchema = new Schema<ITree>(
  {
    tree_id: { type: Number, required: true, unique: true },
    common_name: { type: String, required: true },
    scientific_name: { type: String, required: true },
    description: { type: String, default: '' },
    benefits: { type: [String], default: [] },
    images: { type: [String], default: [] },
    age: { type: Number, default: 0 },
    planted_date: { type: String, required: true },
    health_status: { type: String, default: 'Healthy' },
    planted_by: { type: String, default: '' },
    qr_code: { type: String },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation
const TreeModel: Model<ITree> = mongoose.models.Tree || mongoose.model<ITree>('Tree', TreeSchema);

export default TreeModel;
