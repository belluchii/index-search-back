require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const connectDB = require("./db/index");

fastify.register(require("@fastify/cors"), {
  origin: "*",
});

fastify.register(require("./routes/health"));
fastify.register(require("./routes/products"));
fastify.register(require("./routes/utils"));

let isConnected = false;

async function getApp() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  await fastify.ready();
  return fastify;
}

if (require.main === module) {
  const start = async () => {
    await connectDB();
    await fastify.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" });
  };
  start();
}

module.exports = { getApp, fastify };
