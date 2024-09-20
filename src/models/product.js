import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    description: { type: String },
    category_id: { type: Schema.Types.ObjectId, ref: "Category" },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("Products", productSchema);
