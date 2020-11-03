import Joi from "joi"
import PunishmentAction from "../struct/action/PunishmentAction"

export default Joi.string().custom(value => {
    const result = PunishmentAction.parsePunishment(value)
    if (result instanceof Error) throw result
    else return result
})
