import { Router } from 'express'
import { EntityController } from '../../../App/Controllers/EntityController'
import { createEntityBodySchema, deleteEntityParamsSchema } from './EntityRouterSchemas'
import { validate } from './validation'

const entityRouter = Router()
const entityController = new EntityController()
// Route to create an Entity
entityRouter.post('/', validate(createEntityBodySchema, 'body'), entityController.createEntity)

// Route to delete an Entity
entityRouter.delete('/:id', validate(deleteEntityParamsSchema, 'params'), entityController.deleteEntity)

export { entityRouter }
