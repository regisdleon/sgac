import mongoose, { Schema, Document } from 'mongoose';

export interface IPrize extends Document {
  id: string;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
}

const PrizeSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Prize = mongoose.model<IPrize>('Prize', PrizeSchema); 