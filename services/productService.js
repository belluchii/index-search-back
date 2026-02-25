const product = require("../models/Product");

exports.getProducts = async () => {
  try {
    return await product.aggregate([{ $sample: { size: 10 } }]);
  } catch (error) {
    throw new Error("Failed geting products:", error.message);
  }
};

exports.getAllProducts = async (p, l) => {
  try {
    const limit = parseInt(l) || 10;
    const page = Math.max(1, parseInt(p) || 1);
    const skip = (page - 1) * limit;

    const products = await product.aggregate([
      { $sort: { score: -1 } },
      { $skip: skip },
      { $limit: limit + 1 },
    ]);

    const hasNextPage = products.length > limit;

    return {
      products: products.slice(0, limit),
      hasNextPage,
    };
  } catch (error) {
    throw new Error("Failed getting all products: " + error.message);
  }
};

exports.searchProducts = async (q, p, l) => {
  try {
    const limit = parseInt(l) || 10;
    const page = Math.max(1, parseInt(p) || 1);
    const skip = (page - 1) * limit;

    const products = await product.aggregate([
      { $match: { $text: { $search: q } } },
      { $addFields: { textScore: { $meta: "textScore" } } },
      {
        $addFields: {
          metaScore: {
            $multiply: ["$textScore", { $abs: { $subtract: [1, "$score"] } }],
          },
        },
      },
      { $sort: { score: -1 } },
      { $skip: skip },
      { $limit: limit + 1 },
    ]);

    const hasNextPage = products.length > limit;

    return {
      products: products.slice(0, limit),
      hasNextPage,
    };
  } catch (error) {
    throw new Error("Failed searching products: " + error.message);
  }
};

exports.searchProductsByID = async (id) => {
  try {
    return await product.findById(id);
  } catch (error) {
    throw new Error(`Failed searching product by ID: ${id}`);
  }
};

exports.searchProductsByCategory = async (c, p, l) => {
  try {
    const limit = parseInt(l) || 10;
    const page = Math.max(1, parseInt(p) || 1);
    const skip = (page - 1) * limit;

    const products = await product.aggregate([
      { $match: { category_name: c } },
      { $sort: { score: -1 } },
      { $skip: skip },
      { $limit: limit + 1 },
    ]);

    const hasNextPage = products.length > limit;

    return {
      products: products.slice(0, limit),
      hasNextPage,
    };
  } catch (error) {
    throw new Error(`Failed searching product by Category: ${c}`);
  }
};

exports.getBestSellers = async (p, l) => {
  try {
    const limit = parseInt(l) || 10;
    const page = Math.max(1, parseInt(p) || 1);
    const skip = (page - 1) * limit;

    const products = await product.aggregate([
      { $match: { isBestSeller: true } },
      { $sort: { score: -1 } },
      { $skip: skip },
      { $limit: limit + 1 },
    ]);

    const hasNextPage = products.length > limit;

    return {
      products: products.slice(0, limit),
      hasNextPage,
    };
  } catch (error) {
    throw new Error("Failed searching best sellers");
  }
};
