const indexRouter = require("../routes/index");
const request = require("supertest");

//so we wont have to use actual app. server doesnt need to start
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);

test("index route works", (done) => {
  request(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect({ name: "frodo" })
    .expect(200, done); //done signidies entire test(both sync and async) is completed
});

test("testing route works", (done) => {
  request(app)
    .post("/test")
    .type("form") //Sets the request type to application/x-www-form-urlencoded.
    .send({ item: "hey" }) //this the the form data
    .then(() => {
      request(app)
        .get("/test")
        .expect({ array: ["hey"] }, done); //response should be an object of key(array) and value(hey)
    });
});
