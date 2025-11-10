import Joi from 'joi'

export const createEntityBodySchema = Joi.object({
	name: Joi.string().required(), // "name" should be a string and required
	age: Joi.number().integer().min(0).required(), // "age" should be an integer greater than or equal to 0, and required
	isActive: Joi.boolean().required(), // "isActive" should be a boolean and required
	preferences: Joi.object({
		color: Joi.string().valid('blue', 'red', 'green', 'yellow').required(), // "color" should be a string and one of the valid colors
		size: Joi.string().valid('S', 'M', 'L', 'XL').required() // "size" should be one of the predefined sizes
	}).required(), // "preferences" is required and should follow the nested schema
	tags: Joi.array().items(Joi.string()).min(1).required(), // "tags" should be an array of strings and at least one tag should be present
	relatedUser: Joi.string().length(24).hex().required() // "relatedUser" should be a 24-character hexadecimal string (assuming this is a MongoDB ObjectId)
})

export const deleteEntityParamsSchema = Joi.object({
	id: Joi.string().required()
})
