const Joi = require('joi')

module.exports.userSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/),
    email: Joi.string().required(),
    name: Joi.string(),
    confirmPassword: Joi.ref('password')
})

