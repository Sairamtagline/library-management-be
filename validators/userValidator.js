const Joi = require("joi");

exports.createUserSchema = Joi.object({
  userName: Joi.string()
    .trim()
    .min(3)
    .messages({
      "string.empty": "Username is required",
    })
    .required(),
  name: Joi.string()
    .trim()
    .regex(/^[a-zA-Z ]+$/)
    .messages({
      "string.empty": "Name is required",
      "string.pattern.base": "Name Name Only Contain Alphabet Characters",
    })
    .required(),
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string()
    .min(8)
    .max(32)
    .trim()
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`!@#$%^€@&*()_+\-=[\]{};':"\\|,.<>/?~])/
    )
    .messages({
      "string.max": "Password length Maximum 32",
      "string.min": "Password length Minimum 8",
      "string.empty": "Password cannot be Empty",
      "string.pattern.base":
        "Password Must contain one Uppercase,one Lowercase,one Digit and one Special Character",
    })
    .required(),
  contact: Joi.number()
    .messages({
      "number.empty": "Password cannot be Empty",
    })
    .required(),
});

exports.updateUserSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  updateUser: Joi.object({
    userName: this.createUserSchema.extract("userName").optional(),
    email: this.createUserSchema.extract("userName").optional(),
    password: this.createUserSchema.extract("userName").optional(),
    name: this.createUserSchema.extract("userName").optional(),
    contact: this.createUserSchema.extract("contact").optional(),
  })
    .or("userName", "email", "password", "name", "contact")
    .required(),
});

exports.deleteSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});
