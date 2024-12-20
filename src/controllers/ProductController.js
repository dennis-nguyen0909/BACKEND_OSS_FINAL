const ProductService = require("../services/ProductService");
const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      rating,
      description,
      discount,
    } = req.body;
    if (
      !name ||
      !image ||
      !type ||
      !price ||
      !countInStock ||
      !rating ||
      !discount
    ) {
      return res.status(404).json({
        status: "Error",
        message: "Vui lòng nhập đầy đủ",
      });
    }
    const response = await ProductService.createProduct(req.body);
    return res.status(200).json({
      status: "Ok",
      data: response,
    });
  } catch (error) {
    return res.status(404).json({
      status: "error",
      message: error,
    });
  }
};

module.exports = {
  createProduct,
};
