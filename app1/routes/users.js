// routes/users.js
var express = require("express");

function createUsersRouter(db) {
  var router = express.Router();

  router.post("/", async (req, res, next) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        return res.status(400).json({ message: "bad request" });
      }
      const user = await db.getUser(username);
      if (user) {
        return res.status(400).json({ error: "User name already exists" });
      }
      const userId = await db.createUser(username, password);
      res.status(200).json({ userId: userId });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

module.exports = createUsersRouter;
