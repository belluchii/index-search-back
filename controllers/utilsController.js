const utilsService = require("../services/utilsService");

exports.getCategories = async (request, reply) => {
  try {
    const categories = await utilsService.getCategories();
    reply.send(categories);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

exports.getMaxMinPrice = async (request, reply) => {
  try {
    const maxminPrice = await utilsService.getMaxMinPrice();
    reply.send(maxminPrice);
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};
