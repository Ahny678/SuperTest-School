const supertest = require("supertest");
const makeApp = require("../app");
const createUser = jest.fn();
const getUser = jest.fn();

const app = makeApp({
  createUser,
  getUser,
});

const request = supertest(app);

//post users endpoint
describe("POST /users", () => {
  beforeEach(() => {
    createUser.mockReset();
  });
  describe("Username and password was submitted", () => {
    it("saves username and password to db", async () => {
      const bulkData = [
        { username: "Ahny", password: "gtastic" },
        { username: "Hannibal", password: "will" },
        { username: "Tina", password: "Bette" },
      ];
      for (data of bulkData) {
        createUser.mockReset();
        await request.post("/users").send(data);
        expect(createUser.mock.calls.length).toBe(1);
        expect(createUser.mock.calls[0][0]).toBe(data.username);
        expect(createUser.mock.calls[0][1]).toBe(data.password);
      }
    });

    it("responds with a 200", async () => {
      const response = await request.post("/users").send({
        username: "Ahny",
        password: "gtastic",
      });
      expect(response.statusCode).toBe(200);
    });

    it("responds with a json object containing user id", async () => {
      createUser.mockResolvedValue(4);
      const response = await request.post("/users").send({
        username: "Ahny",
        password: "gtastic",
      });
      expect(response.body.userId).toBe(4);
    });

    it("has json specified in the content-type header", async () => {
      const response = await request.post("/users").send({
        username: "Ahny",
        password: "gtastic",
      });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("Username and password was not submitted", () => {
    it("reponds with a 400 bad request", async () => {
      const response = await request.post("/users").send({});
      expect(response.statusCode).toBe(400);
    });
  });
});
