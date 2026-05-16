const Joi = require("joi");

const UserRegistrationDTO = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  username:Joi.string().min(3).max(10).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Password and confirm password do not match",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10 digits",
    }),
  Status: Joi.string().valid("active", "inactive").default("inactive"),
  gender: Joi.string().valid("male", "female", "other").optional().allow(null),
});

module.exports = UserRegistrationDTO;
