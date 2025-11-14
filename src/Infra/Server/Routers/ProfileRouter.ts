import { Router } from 'express'
import { ProfileController } from '../../../App/Controllers/ProfileController'
import { ProfileService } from '../../../App/Services/ProfileService'
import { ProfileRepository } from '../../DB/Repositories/ProfileRepository'
import { createProfileBodySchema, deleteProfileParamsSchema } from '../Schemas/ProfileRouterSchemas'
import { validate } from './validation'

const profileRouter = Router()
const profileRepository = new ProfileRepository()
const profileService = new ProfileService(profileRepository)
const profileController = new ProfileController(profileService)
// Route to create an Entity
profileRouter.post('/', validate(createProfileBodySchema, 'body'), profileController.createProfile)

// Route to delete an Entity
profileRouter.delete('/:id', validate(deleteProfileParamsSchema, 'params'), profileController.deleteProfile)

export { profileRouter }
