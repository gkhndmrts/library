const router = require("express").Router();
const { User, Borrow, Book } = require("../models/db");
const { ServerError, ValidationError, NotFoundError } = require("../error");
const schema = require("../utils/validator");

router.get("/", async (req, res, next) => {
  const users = await User.findAll();

  res.send(users);
});

router.post("/", async (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return next(new ValidationError());
  }

  try {
    const user = await User.create(req.body);

    return res.send(user);
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
    const user = await User.findOne({
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

    if (!user) return next(new NotFoundError());

    const userWithBooks = {
      id: user.id,
      name: user.name,
      books: { past: [], present: [] },
    };

    user.borrows.forEach((item) => {
      if (item.isReturn) {
        userWithBooks.books.past.push({
          name: item.book.name,
          userScore: item.score,
        });
      } else {
        userWithBooks.books.present.push({
          name: item.book.name,
        });
      }
    });

    return res.send(userWithBooks);
  } catch (error) {
    return next(new ServerError());
  }
});

router.post("/:userID/borrow/:bookID", async (req, res, next) => {
  const obj = {
    userId: req.params.userID,
    bookId: req.params.bookID,
  };

  if (schema.validate(obj).error) {
    return next(new ValidationError());
  }

  const find = await Borrow.findAll({
    where: { bookId: obj.bookId, isReturn: false },
  });

  if (find.length > 0) {
    return next(new ServerError());
  }

  try {
    const borrow = await Borrow.create(obj);

    return res.send(borrow);
  } catch (error) {
    return next(new ServerError());
  }
});

router.post("/:userID/return/:bookID", async (req, res, next) => {
  const returnBook = {
    userId: req.params.userID,
    bookId: req.params.bookID,
    isReturn: true,
    score: req.body.score,
  };

  if (schema.validate(returnBook).error) {
    return next(new ValidationError());
  }

  try {
    const find = await Borrow.update(
      { isReturn: true, score: returnBook.score },
      {
        where: {
          userId: returnBook.userId,
          bookId: returnBook.bookId,
          isReturn: false,
        },
      }
    );

    return res.send(find);
  } catch (error) {
    return next(new ServerError());
  }
});

module.exports = router;
