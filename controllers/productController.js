const productService = require("../services/productService");

exports.getProducts = async (request, reply) => {
  try {
    const products = await productService.getProducts();
    reply.send(products);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.getAllProducts = async (request, reply) => {
  try {
    const { page } = request.query;
    const products = await productService.getAllProducts(page);
    reply.send(products);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.searchProducts = async (request, reply) => {
  try {
    const { query, page } = request.query;
    if (!query || query.length < 3)
      return reply.status(400).send({ error: `Query too short ${query}` });
    const products = await productService.searchProducts(query, page);
    if (!products || products.length === 0) {
      return reply.send({
        products: [],
        message: "No products found",
      });
    }
    reply.send(products);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.searchProductByID = async (request, reply) => {
  try {
    const id = request.params.id;
    if (!id) return reply.status(400).send({ error: `An ID must be provided` });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return reply.status(400).send({ error: "Invalid ID format" });
    }
    const product = await productService.searchProductsByID(id);
    if (!product) {
      return reply.status(404).send({ error: "Product not found" });
    }
    reply.send(product);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.searchProductByCategory = async (request, reply) => {
  try {
    const { category_name, page } = request.query;
    if (!category_name) {
      return reply.status(400).send({ error: "Category name is required" });
    }
    const products = await productService.searchProductsByCategory(
      category_name,
      page,
    );
    reply.send(products);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.getBestSellers = async (request, reply) => {
  try {
    const { page } = request.query;
    const products = await productService.getBestSellers(page);
    reply.send(products);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};
