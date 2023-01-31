require("reflect-metadata");
import { Request, ResponseToolkit, Server } from "hapi";
import { createConnection, getRepository } from "typeorm";
import { Users } from "./entity/Users";
// import { DataSource } from "typeorm";

const Hapi = require("@hapi/hapi");
const dotenv = require("dotenv");

dotenv.config();

interface NewUser {
  id: number;
  name: string;
  Phnumber: number;
}

createConnection({
  type: "postgres",
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: [Users],
  synchronize: true,
  logging: false,
});

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

  server.route({
    method: "POST",
    path: "/allUsers",
    handler: async (request: Request, reply: ResponseToolkit) => {
      const { id, name, Phnumber } = request.payload as NewUser;

      const newUser = new Users();
      newUser.id = 1;
      newUser.name = "firstUser";
      newUser.Phnumber = 12345;

      const userRepo = getRepository(Users);
      await userRepo.insert(newUser);

      return reply
        .response({
          status: "success",
          data: {
            user: newUser,
          },
        })
        .code(201);
    },
  });
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();

// const createNewUser = async () => {
// const AppDataSource = new DataSource({
//   type: "postgres",
//   host: "localhost",
//   port: Number(process.env.PGPORT),
//   username: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   database: process.env.PGDATABASE,
//   entities: [Users],
//   synchronize: true,
//   logging: false,
// });

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Data Source has been initialized!");
//   })
//   .catch((err) => {
//     console.error("Error during Data Source initialization", err);
//   });

// const user = new Users();
// user.name = "First User";
// user.id = 1;
// user.Phnumber = 123456789;

// const createUser = async () => {
//   const userRepository = AppDataSource.getRepository(Users);
//   await userRepository.save(user);
//   console.log("User has been saved. User id is");
// };

// createUser();

// createNewUser();
// const { Client } = require("pg");
// dotenv.config();
// const connectDb = async () => {
//   try {
//     const client = new Client({
//       user: process.env.PGUSER,
//       host: process.env.PGHOST,
//       database: process.env.PGDATABASE,
//       password: process.env.PGPASSWORD,
//       port: process.env.PGPORT,
//     });
//     await client.connect();
//     const res = await client.query("SELECT * FROM notes");
//     console.log(res);
//     await client.end();
//   } catch (error) {
//     console.log(error);
//   }
// };
// connectDb();

////////////////////////////////////////////////////////////////////////

// const insert = async () => {
//   await AppDataSource.manager.save(
//     AppDataSource.manager.create(Users, {
//       id: 1,
//       name: "Saw",
//       Phnumber: 12345,
//     })
//   );
// };
// insert();

// const execute = async (query) => {
//   const client = new Client({
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     password: process.env.PGPASSWORD,
//     port: process.env.PGPORT,
//   });
//   try {
//     await client.connect();
//     await client.query(query);
//     return true;
//   } catch (error) {
//     console.error(error.stack);
//     return false;
//   } finally {
//     await client.end();
//   }
// };

// const text = `
//   CREATE TABLE IF NOT EXISTS "users" (
//     "id" SERIAL,
//     "name" VARCHAR(100) NOT NULL,
//     PRIMARY KEY ("id")
//   );`;

// execute(text).then((result) => {
//   if (result) {
//     console.log("Table created");
//   }
// });

// const updateUser = async (noteTitle, noteId) => {
//   const client = new Client({
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     password: process.env.PGPASSWORD,
//     port: process.env.PGPORT,
//   });
//   const query = `UPDATE "notes"
//                  SET "title" = $1
//                  WHERE "id" = $2`;
//   try {
//     await client.connect();
//     await client.query(query, [noteTitle, noteId]);
//     return true;
//   } catch (error) {
//     console.error(error.stack);
//     return false;
//   } finally {
//     await client.end();
//   }
// };

// updateUser("Tasks To Complete", 1).then((result) => {
//   if (result) {
//     console.log("Note updated");
//   }
// });

// const deleteNotes = async (id) => {
//   const client = new Client({
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     password: process.env.PGPASSWORD,
//     port: process.env.PGPORT,
//   });
//   try {
//     await client.connect();
//     await client.query('DELETE FROM "notes" WHERE id = $1', [id]);
//     return true;
//   } catch (error) {
//     console.error(error.stack);
//     return false;
//   } finally {
//     await client.end();
//   }
// };

// deleteNotes(1).then((result) => {
//   if (result) {
//     console.log("Note deleted");
//   }
// });
