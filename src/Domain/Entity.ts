// src/Domain/Entity/Entity.ts

export class Entity {
	private _id: string
	private _name: string
	private _age: number
	private _isActive: boolean
	private _preferences: {
		color: string
		size: string
	}
	private _tags: string[]
	private _relatedUser: string

	constructor(
		id: string,
		name: string,
		age: number,
		isActive: boolean,
		preferences: { color: string; size: string },
		tags: string[],
		relatedUser: string
	) {
		this._id = id
		this._name = name
		this._age = age
		this._isActive = isActive
		this._preferences = preferences
		this._tags = tags
		this._relatedUser = relatedUser
	}

	// Getters for entity properties
	getId(): string {
		return this._id
	}

	getName(): string {
		return this._name
	}

	getAge(): number {
		return this._age
	}

	getIsActive(): boolean {
		return this._isActive
	}

	getPreferences(): { color: string; size: string } {
		return this._preferences
	}

	getTags(): string[] {
		return this._tags
	}

	getRelatedUser(): string {
		return this._relatedUser
	}

	// Business methods
	activate() {
		this._isActive = true
	}

	deactivate() {
		this._isActive = false
	}

	// Add more business logic as needed...
}
