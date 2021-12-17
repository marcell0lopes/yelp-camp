const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    image: Joi.string()
      .pattern(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
      )
      .required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
  }).required(),
});
