const utilsController = require("../controllers/utilsController");

module.exports = async (fastify) => {
  fastify.get("/categories", utilsController.getCategories);
  fastify.get("/maxminprice", utilsController.getMaxMinPrice);
  fastify.get("/", utilsController.getStatus);
};
