const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");

fastify.register(require("./routes/health"));
fastify.register(require("./routes/products"));
const db = require("./db");
require("dotenv").config();

(async () => {
  await fastify.register(cors, {
    origin: [process.env.FRONTEND_URL],
    methods: ["GET"],
  });

  fastify.get("/", async () => ({
    message: "Welcome to the Amazon Index Search API",
  }));

  fastify.listen(
    { port: process.env.PORT || 3000, host: "0.0.0.0" },
    (err, address) => {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      console.log(`server listening on ${address}`);
      db();
    },
  );
})();
