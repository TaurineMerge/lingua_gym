var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Database from "../../../src/database/config/db-connection.js";
const db = Database.getInstance();
describe("Database Connection Integration Test", () => {
    test("Should connect to the database and run a simple query", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield db.query("SELECT 1 + 1 AS sum");
        expect(result.rows[0].sum).toBe(2);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.close();
    }));
});
