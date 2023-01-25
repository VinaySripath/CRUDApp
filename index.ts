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
    const res = await client.query("SELECT * FROM notes");
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

const execute = async (query) => {
  const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });
  try {
    await client.connect();
    await client.query(query);
    return true;
  } catch (error) {
    console.error(error.stack);
    return false;
  } finally {
    await client.end();
  }
};

const text = `
  CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL,
    "name" VARCHAR(100) NOT NULL,
    PRIMARY KEY ("id")
  );`;

execute(text).then((result) => {
  if (result) {
    console.log("Table created");
  }
});

const updateUser = async (noteTitle, noteId) => {
  const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });
  const query = `UPDATE "notes" 
                 SET "title" = $1
                 WHERE "id" = $2`;
  try {
    await client.connect();
    await client.query(query, [noteTitle, noteId]);
    return true;
  } catch (error) {
    console.error(error.stack);
    return false;
  } finally {
    await client.end();
  }
};

updateUser("Tasks To Complete", 1).then((result) => {
  if (result) {
    console.log("Note updated");
  }
});

const deleteNotes = async (id) => {
  const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });
  try {
    await client.connect();
    await client.query('DELETE FROM "notes" WHERE id = $1', [id]);
    return true;
  } catch (error) {
    console.error(error.stack);
    return false;
  } finally {
    await client.end();
  }
};

deleteNotes(1).then((result) => {
  if (result) {
    console.log("Note deleted");
  }
});
