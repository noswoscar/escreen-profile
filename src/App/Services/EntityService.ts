import { Types } from 'mongoose'
import { Entity } from '../../Domain/Entity'
import { EntityRepository } from '../../Infra/DB/Repositories/EntityRepository'

export class EntityService {
	private entityRepository: EntityRepository

	constructor() {
		this.entityRepository = new EntityRepository()
	}

	// Method to create an entity
	createEntity = async (name: string, age: number, isActive: boolean, preferences: any, tags: any, relatedUser: string): Promise<Entity> => {
		// Create the entity using the repository
		const entity = new Entity(new Types.ObjectId().toString(), name, age, isActive, preferences, tags, relatedUser)
		return await this.entityRepository.create(entity)
	}

	// Method to delete an entity
	deleteEntity = async (id: string): Promise<boolean> => {
		const deletedEntity = await this.entityRepository.delete(id)
		return deletedEntity !== null
	}
}
