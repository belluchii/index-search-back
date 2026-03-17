const product = require("../models/Product");

exports.getCategories = async () => {
  try {
    return await product.distinct("category_name");
  } catch (error) {
    throw new Error("Failed geting categories:", error.message);
  }
};

exports.getMaxMinPrice = async () => {
  try {
    const result = await product.aggregate([
      {
        $group: {
          _id: null,
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" },
        },
      },
    ]);
    return result[0];
  } catch (error) {
    throw new Error("Failed getting max and min prices:", error.message);
  }
};

exports.getStatus = async () => {
  return { status: "ok", message: "API running" };
};
