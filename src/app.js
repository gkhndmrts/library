const express = require("express");
const cors = require("cors");
const app = express();

const { handle } = require("./error");
const { sequelize } = require("./models/db");

const user = require("./routes/user");
const book = require("./routes/book");

sequelize
  .authenticate()
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

(async () => {
  await sequelize.sync({ force: true });
})();

app.use(express.json());
app.use(cors());
app.use("/users", user);
app.use("/books", book);
app.use(handle);

module.exports = app;
