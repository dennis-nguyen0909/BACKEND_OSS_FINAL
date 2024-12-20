const Product = require("../models/ProductModel");
const bcrypt = require("bcrypt");
const createProduct = (data) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      rating,
      description,
      discount,
    } = data;
    let newSize;

    // Xử lý trường hợp 'type' là 'Giày'
    if (type === "Giày") {
      newSize = ["36", "37", "38", "39", "40", "41", "42", "43"];
    }
    // Xử lý trường hợp 'type' là 'Áo'
    else if (type === "Áo" || type === "Quần") {
      newSize = ["S", "M", "L", "XL"];
    }
    // Xử lý trường hợp khác
    else if (type === "Nón") {
      newSize = ["Size 1", "Size 2"]; // Hoặc bất kỳ giá trị mặc định nào bạn muốn
    } else {
      newSize = ["One Size"];
    }
    try {
      const checkProductExist = await Product.findOne({
        name: name,
      });
      if (checkProductExist !== null) {
        resolve({
          status: "Ok",
          message: "Product Name is exist!!",
        });
      }
      const createNewProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock: Number(countInStock),
        rating,
        description,
        discount,
        size: newSize,
      });
      if (createNewProduct) {
        resolve({
          status: "Ok",
          message: "Create Product SuccessFully!!",
          data: createNewProduct,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createProduct,
};
