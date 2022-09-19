const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config");

const sequelize = new Sequelize(config.db);

const User = sequelize.define(
  "user",
  {
    name: DataTypes.STRING,
  },
  { timestamps: false }
);

const Book = sequelize.define(
  "book",
  {
    name: DataTypes.STRING,
  },
  { timestamps: false }
);

const Borrow = sequelize.define(
  "borrow",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    isReturn: { type: DataTypes.BOOLEAN, defaultValue: false },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false }
);

User.hasMany(Borrow);
Borrow.belongsTo(User);
Book.hasMany(Borrow);
Borrow.belongsTo(Book);

module.exports = { sequelize, User, Book, Borrow };
