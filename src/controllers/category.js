import categoryService from "../services/categories.js";

const getAll = async (req, res) => {
  try {
    const category = await categoryService.getCategory();

    res.status(200).json({
      message: "Get By Id successfully",
      data: category,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const product = await categoryService.getCategoryById(req.params.id);

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

const addCategory = async (req, res) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    res
      .status(201)
      .json({ message: "User created successfully", data: newCategory });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    await categoryService.updateCategoryById(req.params.id, req.body);
    res
      .status(200)
      .json({ message: "Updated product successfully", data: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategoryById(req.params.id);
    res
      .status(200)
      .json({ message: "Deleted product successfully", data: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export default { getAll, getById, addCategory, updateCategory, deleteCategory };
