const usersRouter = require("../routes/users");
const request = require("supertest");

//so we wont have to use actual app. server doesnt need to start
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use("/users", usersRouter);

//mock database
jest.mock("../db/queries");
const db = require("../db/queries");

beforeEach(() => {
  jest.clearAllMocks();
});
//the case of username and password passed
describe("Username and password received", () => {
  test("Signup works", async () => {
    const userId = 123;
    db.createUser.mockResolvedValue(userId);
    const res = await request(app)
      .post("/users/signup")
      .type("form")
      .send({ username: "testuser", password: "testpass" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: userId });
    expect(db.createUser).toHaveBeenCalledTimes(1);
    expect(db.createUser).toHaveBeenCalledWith("testuser", "testpass");
  });
});

describe("Username/password not passed", () => {
  test("Bad request scenario", (done) => {
    request(app)
      .post("/users/signup")
      .send({})
      .expect(400)
      .expect({ message: "Missing crendentials" })
      .end(done);
  });
});

describe("Existing user", () => {
  test("Username already exists", async () => {
    const user = { username: "existingUser", password: "pass123" };
    db.getUser.mockResolvedValue(user);
    const res = await request(app)
      .post("/users/signup")
      .type("form")
      .send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Username already exists" });
    expect(db.getUser).toHaveBeenCalledTimes(1);
  });
});
