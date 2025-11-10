import { NextFunction, Request, Response } from 'express'
import * as Joi from 'joi'
import logger from '../../Logger/WinstonLogger'

export const validate = (schema: Joi.Schema, source: 'body' | 'params') => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.validate(req[source], {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: true
		})

		if (result.error) {
			logger.error(`Joi validation error in ${req.url} (${source})`)
			return res.status(422).json({
				status: 'validation failed',
				error: result.error.details
			})
		}

		req[source] = result.value
		next()
	}
}
