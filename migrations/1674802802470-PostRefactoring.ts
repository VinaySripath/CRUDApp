import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoring1674802802470 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users (
                id int,
                name varchar(50),
                Phnumber int,
             );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users`);
  }
}
