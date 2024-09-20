import Product from "../models/product.js";
import redisClient from "../config/redis.js";

const getAllProducts = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;

    const product = await Product.find()
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Product.countDocuments(); // Barcha hujjatlarni hisoblash

    if (product.length === 0) {
      return { message: "product not found", data: false };
    }

    return {
      message: "Get By Id successfully",
      data: product,
      totalPages: Math.ceil(total / limit), // Umumiy sahifalar soni
      currentPage: Number(page), // Joriy sahifa
    };
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (id) => {
  try {
    const cachedProduct = await redisClient.get(`product:${id}`);

    if (cachedProduct) {
      return JSON.parse(cachedProduct);
    }

    const product = await Product.findById(id);

    if (product) {
      await redisClient.set(`product:${id}`, JSON.stringify(product), {
        EX: 8400, // Cache muddati (1 soat)
      });
    }

    return product;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const getAllProductsByCategoryId = async (page, limit, categoryId) => {
  try {
    const skip = (page - 1) * limit;

    const products = await Product.find({ category_id: categoryId.toString() })
      .limit(Number(limit))
      .skip(Number(skip));

    const total = await Product.countDocuments({ category_id: categoryId });
    
    if (products.length === 0) {
      return { message: "product not found", data: false };
    }

    return {
      message: "Get By Id successfully",
      data: products,
      totalPages: Math.ceil(total / limit), // Umumiy sahifalar soni
      currentPage: Number(page), // Joriy sahifa
    };
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const addProduct = async (body) => {
  try {
    const newProduct = new Product(body);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllProducts,
  getAllProductsByCategoryId,
  addProduct,
  getProductById,
};
