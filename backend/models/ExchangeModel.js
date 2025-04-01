import mongoose from "mongoose";

const ExchangeBookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String },
    description: { type: String },
    condition: { type: String, required: true, enum: ["New", "Like New", "Good", "Fair", "Worn"] },
    ownerName: { type: String, required: true },
    contactInfo: { type: String, required: true },
    available: { type: Boolean, default: true },
    location: { type: String },
    bookImage: { type: String }, 
  },
  { timestamps: true }
);

// Create and export model correctly
const ExchangeModel = mongoose.model("ExchangeBook", ExchangeBookSchema);
export default ExchangeModel;
