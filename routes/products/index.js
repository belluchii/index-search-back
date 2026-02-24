const productController = require("../../controllers/productController");

module.exports = async (fastify) => {
  fastify.get("/products", productController.getProducts);
  fastify.get("/products/all", productController.getAllProducts);
  fastify.get("/searchProducts", productController.searchProducts);
  fastify.get("/searchProductByID/:id", productController.searchProductByID);
  fastify.get(
    "/searchProductByCategory",
    productController.searchProductByCategory,
  );
  fastify.get("/bestSellers", productController.getBestSellers);
};
