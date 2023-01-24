const Hapi = require("@hapi/hapi");

const dotenv = require("dotenv");
dotenv.config();

const { Client } = require("pg");
dotenv.config();
const connectDb = async () => {
  try {
    const client = new Client({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
    });
    await client.connect();
    const res = await client.query("SELECT * FROM some_table");
    console.log(res);
    await client.end();
  } catch (error) {
    console.log(error);
  }
};
connectDb();

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return "Hello World!";
    },
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
