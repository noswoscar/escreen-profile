import Joi from 'joi'

// CREATE PROFILE BODY SCHEMA
export const createProfileBodySchema = Joi.object({
	id: Joi.string().required(), // required
	username: Joi.string().required(), // required
	email: Joi.string().email().required(), // required

	age: Joi.number().integer().min(0).optional(),
	profile_image_url: Joi.string().uri().optional(),

	allows_browser_notifications: Joi.boolean().optional(),
	allows_email_notifications: Joi.boolean().optional(),
	allows_sms_notifications: Joi.boolean().optional(),
	allows_geolocation: Joi.boolean().optional()
})

// DELETE PROFILE PARAMS SCHEMA
export const deleteProfileParamsSchema = Joi.object({
	id: Joi.string().required()
})

export const getUserProfileParamsSchema = Joi.object({
	id: Joi.string().required()
})

export const getUserProfileBodySchema = Joi.object({
	username: Joi.string().required(),
	email: Joi.string().required()
})
