const handle = (err, req, res, next) => {
  if (err instanceof ServerError) {
    return res.status(500).end();
  }
  if (err instanceof ValidationError) {
    return res.status(400).end();
  }
  if (err instanceof NotFoundError) {
    return res.status(404).end();
  }
};

class ServerError {}
class ValidationError {}
class NotFoundError {}

module.exports = { handle, ServerError, ValidationError, NotFoundError };
