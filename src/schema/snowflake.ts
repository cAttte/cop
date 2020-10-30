import Joi from "joi"

export default Joi.string()
    .pattern(/^[0-9]+$/)
    .length(18)
