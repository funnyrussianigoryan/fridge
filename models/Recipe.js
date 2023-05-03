import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    composition: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductLib",
          required: true,
        },
        count: Number,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    avatarUrl: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Recipe", RecipeSchema);
