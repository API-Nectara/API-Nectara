import db_connection from "../database/db_connection.js";

beforeAll(async () => {
  await db_connection.authenticate();
  await db_connection.sync({ force: true });
});

afterAll(async () => {
  await db_connection.close();
});