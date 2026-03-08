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

exports.getAllProducts = async (p, l, iBS, c, minP, maxP, minS, s) => {
  try {
    const limit = parseInt(l) || 10;
    const page = Math.max(1, parseInt(p) || 1);
    const skip = (page - 1) * limit;
    const sortStage =
      s === "price_asc"
        ? { price: 1 }
        : s === "price_desc"
          ? { price: -1 }
          : { score: -1 };

    const matchStage = {
      ...(c && { category_name: c }),
      ...(iBS && { isBestSeller: iBS === "true" }),
      ...((minP || maxP) && {
        price: {
          ...(minP && { $gte: parseFloat(minP) }),
          ...(maxP && { $lte: parseFloat(maxP) }),
        },
      }),
      ...(minS && { stars: { $gte: parseFloat(minS) } }),
    };

    const [result] = await product.aggregate(
      [
        {
          $facet: {
            products: [
              { $match: matchStage },
              { $sort: sortStage },
              { $skip: skip },
              { $limit: limit },
            ],
            total: [{ $match: matchStage }, { $count: "count" }],
          },
        },
      ],
      { allowDiskUse: true },
    );

    return {
      products: result.products,
      totalPages: Math.ceil((result.total[0]?.count || 0) / limit),
    };
  } catch (error) {
    throw new Error("Failed getting all products: " + error.message);
  }
};

exports.searchProducts = async (q, p, l, iBS, c, minP, maxP, minS, s) => {
  try {
    const limit = parseInt(l) || 10;
    const page = Math.max(1, parseInt(p) || 1);
    const skip = (page - 1) * limit;
    const sortStage =
      s === "price_asc"
        ? { price: 1 }
        : s === "price_desc"
          ? { price: -1 }
          : { score: -1 };

    const matchStage = {
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
    };

    const [result] = await product.aggregate(
      [
        { $match: matchStage },
        { $addFields: { textScore: { $meta: "textScore" } } },
        {
          $addFields: {
            metaScore: {
              $multiply: ["$textScore", { $abs: { $subtract: [1, "$score"] } }],
            },
          },
        },
        {
          $facet: {
            products: [
              { $sort: sortStage },
              { $skip: skip },
              { $limit: limit },
            ],
            total: [{ $count: "count" }],
          },
        },
      ],
      { allowDiskUse: true },
    );

    return {
      products: result.products,
      totalPages: Math.ceil((result.total[0]?.count || 0) / limit),
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
