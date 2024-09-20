import Category from "../models/category.js";

const getCategory = async () => {
  try {
    const category = await Category.find();

    if (category.length === 0) {
      return { message: "Category not found", data: false };
    }

    return category;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const getCategoryById = async (id) => {
  try {
    return await Category.findById(id);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const createCategory = async (body) => {
  try {
    const newCategory = new Category(body);

    return await newCategory.save();
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const updateCategoryById = async (id, body) => {
  try {
    await Category.findByIdAndUpdate(
      id,
      {
        $set: { ...body },
      },
      { new: true }
    );
    return true;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const deleteCategoryById = async (id) => {
  try {
    return await Category.findByIdAndDelete(id);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

export default {
  getCategory,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};
