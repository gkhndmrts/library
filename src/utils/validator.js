const Joi = require("joi");

const schema = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string().min(1).max(250),
  userId: Joi.number().integer(),
  bookId: Joi.number().integer(),
  score: Joi.number().integer(),
  isReturn: Joi.bool(),
});

module.exports = schema;
