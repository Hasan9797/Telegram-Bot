import Order from "../models/order.js";

export const getOrders = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;

    const order = await Order.find().limit(Number(limit)).skip(Number(skip));

    const total = await Order.countDocuments(); // Barcha hujjatlarni hisoblash

    if (order.length === 0) {
      return { message: "Order not found", data: false };
    }

    return {
      message: "Get By Id successfully",
      data: order,
      totalPages: Math.ceil(total / limit), // Umumiy sahifalar soni
      currentPage: Number(page), // Joriy sahifa
    };
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const addOrder = async (body) => {
  try {
    const newOrder = new Order({
      body,
    });
    await newOrder.save();
    return newOrder;
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
