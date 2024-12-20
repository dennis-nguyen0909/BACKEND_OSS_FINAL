const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authMiddleware } = require("../middleware/authMiddleware");
const ProductRouter = (app) => {
  router.post("/create", ProductController.createProduct);
  router.put("/update/:id", authMiddleware, ProductController.updateProduct);
  router.delete("/delete/:id", authMiddleware, ProductController.deleteProduct);
  // router.get('/details/:id', authMiddleware, ProductController.getDetailProduct);
  router.get("/details/:id", ProductController.getDetailProduct);
  return app.use("/api/product", router);
};

module.exports = ProductRouter;
