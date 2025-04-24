const pool = require("./pool");

exports.getUser = async (username) => {
  const { rows } = await pool.query(
    `
        SELECT * FROM Users WHERE username= $1
        `,
    [username]
  );
  return rows[0];
};

exports.createUser = async (username, password) => {
  const { insertRow } = await pool.query(
    `
        INSERT INTO Users (username, password) VALUES ($1, $2) RETURNING id
        `,
    [username, password]
  );
  const id = insertRow[0].id;
  return id;
};
