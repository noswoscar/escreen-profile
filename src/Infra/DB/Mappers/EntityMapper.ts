import { Types } from 'mongoose'
import { Entity } from '../../../Domain/Entity'
import { EntityModel } from '../Models/Entity'

export class EntityMapper {
	// Convert Mongoose EntityModel to Domain Entity
	toDomain(savedEntity: any): Entity {
		const id = savedEntity._id instanceof Types.ObjectId ? savedEntity._id.toString() : String(savedEntity._id ?? '')
		return new Entity(
			id,
			savedEntity.name,
			savedEntity.age,
			savedEntity.isActive,
			savedEntity.preferences,
			savedEntity.tags,
			savedEntity.relatedUser?.toString() ?? null
		)
	}

	// Convert Domain Entity to Mongoose EntityModel
	toModel(entity: Entity): any {
		return new EntityModel({
			id: entity.getId(),
			name: entity.getName(),
			age: entity.getAge(),
			isActive: entity.getIsActive(),
			preferences: entity.getPreferences(),
			tags: entity.getTags(),
			relatedUser: entity.getRelatedUser()
		})
	}
}
