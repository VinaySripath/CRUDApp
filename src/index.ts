import { AppDataSource } from "./data-source";
import { Users } from "./entity/Users";

AppDataSource.initialize()
  .then(async () => {
    console.log("Inserting a new user into the database...");
    const user = new Users();
    user.name = "Timber";
    user.id = 1;
    user.Phnumber = 12345;
    await AppDataSource.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    const user2 = new Users();
    user2.name = "Second user";
    user2.id = 2;
    user2.Phnumber = 123456;
    await AppDataSource.manager.save(user2);
    console.log("Saved a new user with id: " + user2.id);

    console.log("Loading users from the database...");
    const users = await AppDataSource.manager.find(Users);
    console.log("Loaded users: ", users);

    await AppDataSource.createQueryBuilder()
      .update(Users)
      .set({ name: "Timber Saw" })
      .where("id = :id", { id: 1 })
      .execute();

    await AppDataSource.createQueryBuilder()
      .delete()
      .from(Users)
      .where("id = :id", { id: 2 })
      .execute();

    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );
  })
  .catch((error) => console.log(error));
