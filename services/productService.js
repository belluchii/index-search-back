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

exports.getAllProducts = async (
  after,
  limit = 10,
  iBS,
  c,
  minP,
  maxP,
  minS,
  s,
) => {
  try {
    const numLimit = parseInt(limit) || 10;
    const {
      Types: { ObjectId },
    } = require("mongoose");

    const sortField =
      s === "price_asc" ? "price" : s === "price_desc" ? "price" : "score";
    const sortDir = s === "price_asc" ? 1 : -1;
    const sortObject = { [sortField]: sortDir, _id: sortDir };

    let cursorMatch = {};
    if (after) {
      const { sortValue, id } = JSON.parse(
        Buffer.from(after, "base64").toString(),
      );
      cursorMatch = {
        $or: [
          {
            [sortField]:
              sortDir === 1 ? { $gt: sortValue } : { $lt: sortValue },
          },
          { [sortField]: sortValue, _id: { $gt: new ObjectId(id) } },
        ],
      };
    }

    const matchStage = {
      ...cursorMatch,
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
        { $sort: sortObject },
        { $limit: numLimit + 1 },
        {
          $facet: {
            products: [{ $limit: numLimit }],
            next: [{ $skip: numLimit }, { $limit: 1 }],
          },
        },
      ],
      { allowDiskUse: true, maxTimeMS: 15000 },
    );

    const products = result.products || [];
    const hasNext = result.next?.length > 0;
    const lastDoc = products[products.length - 1];
    const nextCursor =
      hasNext && lastDoc
        ? Buffer.from(
            JSON.stringify({ sortValue: lastDoc[sortField], id: lastDoc._id }),
          ).toString("base64")
        : null;

    return { products, nextCursor, hasNext };
  } catch (error) {
    throw new Error("Failed getting all products: " + error.message);
  }
};

exports.searchProducts = async (q, after, l, iBS, c, minP, maxP, minS, s) => {
  try {
    const limit = parseInt(l) || 10;
    const { Types: { ObjectId } } = require("mongoose");

    const sortField = s === "price_asc" ? "price" : s === "price_desc" ? "price" : "metaScore";
    const sortDir = s === "price_asc" ? 1 : s === "price_desc" ? -1 : -1;
    const sortObject = { [sortField]: sortDir, _id: sortDir };

    let cursorMatch = {};
    if (after) {
      const { sortValue, id } = JSON.parse(Buffer.from(after, "base64").toString());
      cursorMatch = {
        $or: [
          { [sortField]: sortDir === 1 ? { $gt: sortValue } : { $lt: sortValue } },
          { [sortField]: sortValue, _id: { $gt: new ObjectId(id) } },
        ],
      };
    }

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
        { $match: cursorMatch },
        { $sort: sortObject },
        { $limit: limit + 1 },
        {
          $facet: {
            products: [{ $limit: limit }],
            next: [{ $skip: limit }, { $limit: 1 }],
          },
        },
      ],
      { allowDiskUse: true },
    );

    const products = result.products || [];
    const hasNext = result.next?.length > 0;
    const lastDoc = products[products.length - 1];
    const nextCursor =
      hasNext && lastDoc
        ? Buffer.from(JSON.stringify({ sortValue: lastDoc[sortField], id: lastDoc._id })).toString("base64")
        : null;

    return { products, nextCursor, hasNext };
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
