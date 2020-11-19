import Joi from "joi"
import PunishmentProvider from "../struct/PunishmentProvider"

export default Joi.string().custom(value => {
    const result = new PunishmentProvider(null).parsePunishment(value)
    if (result instanceof Error) throw result
    else return result
})
