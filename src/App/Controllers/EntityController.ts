import { Request, Response } from 'express'
import logger from '../../Infra/Logger/WinstonLogger'
import { EntityService } from '../Services/EntityService'

export class EntityController {
	private entityService: EntityService

	constructor() {
		this.entityService = new EntityService() // Initialize the service
	}

	// Method to create an entity
	createEntity = async (req: Request, res: Response): Promise<void> => {
		try {
			logger.info('Creating a new entity object')
			const { name, age, isActive, preferences, tags, relatedUser } = req.body

			// Use EntityService to create the entity
			const createdEntity = await this.entityService.createEntity(name, age, isActive, preferences, tags, relatedUser)

			res.status(201).json({
				message: 'Entity created successfully',
				data: createdEntity // Return the created entity
			})
		} catch (error) {
			res.status(500).json({
				message: 'Error creating entity',
				error: error instanceof Error ? error.message : 'Unknown error'
			})
		}
	}

	// Method to delete an entity
	deleteEntity = async (req: Request, res: Response): Promise<void> => {
		try {
			logger.info(`Deleting an entity object with id ${req.params.id}`)
			const { id } = req.params

			// Use EntityService to delete the entity
			const isDeleted = await this.entityService.deleteEntity(id)

			if (isDeleted) {
				res.status(200).json({ message: 'Entity deleted successfully' })
			} else {
				res.status(404).json({ message: 'Entity not found' })
			}
		} catch (error) {
			res.status(500).json({
				message: 'Error deleting entity',
				error: error instanceof Error ? error.message : 'Unknown error'
			})
		}
	}
}
