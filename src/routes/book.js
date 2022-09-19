const router = require("express").Router();
const schema = require("../utils/validator");
const { ServerError, ValidationError, NotFoundError } = require("../error");
const { Book, Borrow } = require("../models/db");

router.get("/", async (req, res) => {
  const books = await Book.findAll();

  res.send(books);
});

router.post("/", async (req, res, next) => {
  const { name } = req.body;

  if (schema.validate({ name }).error) {
    return next(new ValidationError());
  }

  try {
    const book = await Book.create({ name });

    return res.send(book);
  } catch (error) {
    return next(new ServerError());
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (schema.validate({ id }).error) {
    return next(new ValidationError());
  }

  try {
    const book = await Book.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Borrow,
          include: [Book],
        },
      ],
    });

    if (!book) return next(new NotFoundError());

    const bookWithAvarageScore = {
      id: book.id,
      name: book.name,
      avarageScore: 0,
    };

    let counter = 0;
    book.borrows.forEach((item) => {
      if (item.isReturn) {
        bookWithAvarageScore.avarageScore += item.score;
        counter++;
      }
    });

    if (counter > 0) {
      bookWithAvarageScore.avarageScore /= counter;
    } else {
      bookWithAvarageScore.avarageScore = -1;
    }

    return res.send(bookWithAvarageScore);
  } catch (error) {
    return next(new ServerError());
  }
});

module.exports = router;
