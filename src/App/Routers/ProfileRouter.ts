import { Router } from 'express'
import { ProfileRepository } from '../../Infra/DB/Repositories/ProfileRepository'
import { ProfileController } from '../Controllers/ProfileController'
import {
	createProfileBodySchema,
	deleteProfileParamsSchema,
	getUserProfileBodySchema,
	getUserProfileParamsSchema
} from '../Schemas/ProfileRouterSchemas'
import { ProfileService } from '../Services/ProfileService'
import { validate } from './validation'

const profileRouter = Router()
const profileRepository = new ProfileRepository()
const profileService = new ProfileService(profileRepository)
const profileController = new ProfileController(profileService)
// Route to create an Entity
profileRouter.post('/', validate(createProfileBodySchema, 'body'), profileController.createProfile).bind(profileController)

// Route to create an Entity
profileRouter
	.put(
		'/getUserProfile/:id',
		validate(getUserProfileParamsSchema, 'params'),
		validate(getUserProfileBodySchema, 'params'),
		profileController.findOrCreateUserProfile
	)
	.bind(profileController)

// Route to delete an Entity
profileRouter.delete('/:id', validate(deleteProfileParamsSchema, 'params'), profileController.deleteProfile).bind(profileController)

export { profileRouter }
