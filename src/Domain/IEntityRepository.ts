// src/Domain/Entity/IEntityRepository.ts

import { Entity } from './Entity'

export interface IEntityRepository {
	create(entity: Entity): Promise<Entity>
	delete(id: string): Promise<boolean>
}
