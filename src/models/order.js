import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    products: [
      {
        product: { type: Object, required: true },
        count: { type: Number, default: 1 },
      },
    ],
    user_name: { type: String, required: true },
    first_name: { type: String, required: true },
    chat_id: { type: Number, required: true },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("Order", orderSchema);
