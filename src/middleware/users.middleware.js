const joi = require("joi");

const ValidUserCreation = async (req, res, next) => {
  try {
    const schema = joi.object({
      username: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().required(),
      gender: joi.string().valid("male", "female"),
      contact: joi.string().required(),
      phone_number: joi.string().required(),
    });

    await schema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (error) {
    return res.status(422).json({
      status: "FAILED",
      error: error.message,
    });
  }
};

const loginValidation = async (req, res, next) => {
  try {
    const schema = joi.object({
      password: joi.string().required(),
      email: joi.string().email().required(),
    });

    await schema.validateAsync(req.body, { abortEarly: true });
    next();
  } catch (error) {
    return res.status(422).json({
      messasge: error.message,
      status: "FAILED",
    });
  }
};

const isAuth = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/users/login");
  }
};

module.exports = {
  ValidUserCreation,
  loginValidation,
  isAuth,
};
