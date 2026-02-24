const fastify = require("fastify")({ logger: true });

fastify.register(require("./routes/health"));
fastify.register(require("./routes/products"));
const db = require("./db");
require("dotenv").config();

fastify.get("/", async () => ({
  message: "Welcome to the Amazon Index Search API",
}));

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`server listening on ${address}`);
  db();
});
