import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    products: [
      {
        product: { type: Object, required: true },
        count: { type: Number, default: 1 },
      },
    ],
    userId: { type: Schema.Types.ObjectId, ref: "Users" },

    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("Order", orderSchema);
