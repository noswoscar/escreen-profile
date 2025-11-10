// src/Repositories/EntityRepository.ts

import { Entity } from '../../../Domain/Entity' // Correct path to your Entity class
import { IEntityRepository } from '../../../Domain/IEntityRepository'
import { EntityMapper } from '../Mappers/EntityMapper'
import { EntityModel } from '../Models/Entity' // Correct path to your Mongoose model

export class EntityRepository implements IEntityRepository {
	private entityMapper: EntityMapper
	constructor() {
		this.entityMapper = new EntityMapper()
	}
	async create(entity: Entity): Promise<Entity> {
		try {
			// Convert domain Entity to Mongoose EntityModel and save it
			const entityModel = this.entityMapper.toModel(entity)
			const savedEntity = entityModel.save()

			// Convert saved EntityModel back to domain Entity
			return this.entityMapper.toDomain(savedEntity)
		} catch (error) {
			throw new Error(`Error creating entity: ${error instanceof Error ? error.message : 'Unknown error'}`)
		}
	}

	// Method to delete an entity by ID
	async delete(id: string): Promise<boolean> {
		try {
			// Check if the entity exists and delete it
			const result = await EntityModel.findByIdAndDelete(id)

			// Return true if the entity was deleted, otherwise false
			return result !== null
		} catch (error) {
			throw new Error('Error deleting entity: ' + error.message)
		}
	}
}
