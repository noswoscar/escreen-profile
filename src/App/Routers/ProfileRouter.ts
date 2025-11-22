import { Router } from 'express'
import { ProfileRepository } from '../../Infra/DB/Repositories/ProfileRepository'
import { ProfileController } from '../Controllers/ProfileController'
import {
	createProfileBodySchema,
	deleteProfileParamsSchema,
	getUserProfileBodySchema,
	getUserProfileParamsSchema,
	updateProfileBodySchema,
	updateProfileParamsSchema
} from '../Schemas/ProfileRouterSchemas'
import { ProfileService } from '../Services/ProfileService'
import { validate } from './validation'

const profileRouter = Router()
const profileRepository = new ProfileRepository()
const profileService = new ProfileService(profileRepository)
const profileController = new ProfileController(profileService)

// Create profile
profileRouter.post('/', validate(createProfileBodySchema, 'body'), profileController.createProfile)

// Find or create profile
profileRouter.put(
	'/:id',
	validate(getUserProfileParamsSchema, 'params'),
	validate(getUserProfileBodySchema, 'body'),
	profileController.findOrCreateUserProfile
)

// Update profile
profileRouter.post(
	'/update/:id',
	validate(updateProfileParamsSchema, 'params'),
	validate(updateProfileBodySchema, 'body'),
	profileController.updateUserProfile
)

// Delete profile
profileRouter.delete('/:id', validate(deleteProfileParamsSchema, 'params'), profileController.deleteProfile)

export { profileRouter }
