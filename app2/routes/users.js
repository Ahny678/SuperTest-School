var express = require("express");
var router = express.Router();
const db = require("../db/queries");

router.post("/signup", async function (req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Missing crendentials" });
    }

    const user = await db.getUser(username);
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const userId = await db.createUser(username, password);
    res.status(200).json({ id: userId });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
