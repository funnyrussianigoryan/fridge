import mongoose from "mongoose";

const ProductLibSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Продукты, которые я использую",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    products: [
      {
        prouductName: {
          type: String,
          required: true,
        },
        proteins: {
          type: Number,
          required: true,
        },
        carbohydrates: {
          type: Number,
          required: true,
        },
        fat: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        avatarUrl: String,
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ProductLib", ProductLibSchema);
