import Database from "../../../src/database/config/db-connection.js";

const db = Database.getInstance();

describe("Database Connection Integration Test", () => {
  test("Should connect to the database and run a simple query", async () => {
    const result = await db.query("SELECT 1 + 1 AS sum");

    expect(result.rows[0].sum).toBe(2);
  });

  afterAll(async () => {
    await db.close();
  });
});
