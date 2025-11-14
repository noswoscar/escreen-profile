// src/Infra/DB/Repositories/ProfileRepository.ts

import { Types } from 'mongoose'
import { IProfileRepository } from '../../../Domain/IProfileRepository'
import { Profile } from '../../../Domain/Profile'
import { ProfileMapper } from '../Mappers/ProfileMapper'
import { ProfileModel } from '../Models/Profile'

export class ProfileRepository implements IProfileRepository {
	private profileMapper: ProfileMapper

	constructor() {
		this.profileMapper = new ProfileMapper()
	}

	// -----------------------------
	// CREATE
	// -----------------------------
	async create(profile: Profile): Promise<Profile> {
		try {
			const profileModel = this.profileMapper.toModel(profile)
			const saved = await profileModel.save()
			return this.profileMapper.toDomain(saved)
		} catch (error: any) {
			throw new Error(`Error creating profile: ${error.message}`)
		}
	}

	// -----------------------------
	// FIND BY ID (Objectid field)
	// -----------------------------
	async findById(id: Types.ObjectId): Promise<Profile | null> {
		try {
			const found = await ProfileModel.findById(id) // ✅ query by _id
			return found ? this.profileMapper.toDomain(found) : null
		} catch (error: any) {
			throw new Error(`Error finding profile by ID: ${error.message}`)
		}
	}

	// -----------------------------
	// FIND ALL
	// -----------------------------
	async findAll(): Promise<Profile[]> {
		try {
			const records = await ProfileModel.find()
			return records.map((doc) => this.profileMapper.toDomain(doc))
		} catch (error: any) {
			throw new Error(`Error retrieving profiles: ${error.message}`)
		}
	}

	// -----------------------------
	// UPDATE USING Object id
	// -----------------------------
	async update(id: Types.ObjectId, profile: Profile): Promise<Profile | null> {
		const updated = await ProfileModel.findByIdAndUpdate(
			id,
			{
				username: profile.getUsername(),
				email: profile.getEmail(),
				age: profile.getAge(),
				profileImageUrl: profile.getProfileImageUrl(),
				allowsBrowserNotifications: profile.getAllowsBrowserNotifications(),
				allowsEmailNotifications: profile.getAllowsEmailNotifications(),
				allowsSmsNotifications: profile.getAllowsSmsNotifications(),
				allowsGeolocation: profile.getAllowsGeolocation()
			},
			{ new: true }
		)

		return updated ? this.profileMapper.toDomain(updated) : null
	}

	// -----------------------------
	// DELETE USING domain ObjectId
	// -----------------------------
	async delete(id: Types.ObjectId): Promise<boolean> {
		try {
			const result = await ProfileModel.findByIdAndDelete(id)
			return result !== null
		} catch (error: any) {
			throw new Error(`Error deleting profile: ${error.message}`)
		}
	}
}
