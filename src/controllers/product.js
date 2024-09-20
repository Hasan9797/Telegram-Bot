import Product from "../models/product.js";
import productService from "../services/products.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default qiymatlar
    const products = await productService.getAllProducts(page, limit);

    res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getAllByCategory = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoryId = 1 } = req.query; // Default qiymatlar
    const products = await productService.getAllProductsByCategoryId(
      page,
      limit,
      categoryId
    );

    res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category_id",
      "name"
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", data: false });
    }
    res.status(200).json({ message: "Get By Id successfully", data: product });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
// Creat a new User

export const addProduct = async (req, res) => {
  try {
    const newProduct = await productService.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: { ...req.body },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Updated product successfully", data: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (res, req) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Deleted product successfully", data: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
