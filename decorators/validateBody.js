import HttError from "../helpers/HttpError.js";
// This hellpers validate body according to the scheme
const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttError(400, error.message));
    }
    next();
  };
  return func;
};

export default validateBody;
