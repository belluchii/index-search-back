const productController = require("../../controllers/productController");

module.exports = async (fastify) => {
  fastify.get("/products", productController.getProducts);
  fastify.get("/products/all", productController.getAllProducts);
  fastify.get("/products/search", productController.searchProducts);
  fastify.get("/products/search/:id", productController.searchProductByID);
};
