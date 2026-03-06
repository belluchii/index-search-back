const product = require("../models/Product");

exports.getProducts = async () => {
  try {
    return await product.aggregate([
      {
        $match: {
          category: { $ne: "Sexual Wellness Products" },
        },
      },
      { $sample: { size: 10 } },
    ]);
  } catch (error) {
    throw new Error("Failed geting products:", error.message);
  }
};

exports.getAllProducts = async (p, l, iBS, c, minP, maxP, minS) => {
  try {
    const limit = parseInt(l) || 10;
    const page = Math.max(1, parseInt(p) || 1);
    const skip = (page - 1) * limit;

    const products = await product.aggregate([
      {
        $match: {
          ...(c && { category_name: c }),
          ...(iBS && { isBestSeller: iBS === "true" }),
          ...((minP || maxP) && {
            price: {
              ...(minP && { $gte: parseFloat(minP) }),
              ...(maxP && { $lte: parseFloat(maxP) }),
            },
          }),
          ...(minS && { stars: { $gte: parseFloat(minS) } }),
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
    throw new Error("Failed getting all products: " + error.message);
  }
};

exports.searchProducts = async (q, p, l, iBS, c, minP, maxP, minS) => {
  try {
    const limit = parseInt(l) || 10;
    const page = Math.max(1, parseInt(p) || 1);
    const skip = (page - 1) * limit;

    const products = await product.aggregate([
      {
        $match: {
          $text: { $search: q },
          ...(c && { category_name: c }),
          ...(iBS && { isBestSeller: iBS === "true" }),
          ...((minP || maxP) && {
            price: {
              ...(minP && { $gte: parseFloat(minP) }),
              ...(maxP && { $lte: parseFloat(maxP) }),
            },
          }),
          ...(minS && { stars: { $gte: parseFloat(minS) } }),
        },
      },
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
