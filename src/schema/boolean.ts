import Joi from "joi"

export default Joi.boolean()
    .truthy("true", "t", "y", "ye", "yes", "yeah", "yup")
    .falsy("false", "f", "n", "no", "nah", "nope")
