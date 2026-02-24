module.exports = async (fastify, opts) => {
  fastify.get("/health", async () => {
    return { status: "ok" };
  });
};
