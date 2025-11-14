// src/Repositories/ProfileRepository.ts

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
			const savedProfile = await profileModel.save()
			return this.profileMapper.toDomain(savedProfile)
		} catch (error: any) {
			throw new Error(`Error creating profile: ${error.message}`)
		}
	}

	// -----------------------------
	// FIND BY ID
	// -----------------------------
	async findById(id: string): Promise<Profile | null> {
		try {
			const found = await ProfileModel.findById(id)
			if (!found) return null

			return this.profileMapper.toDomain(found)
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
			return records.map((p) => this.profileMapper.toDomain(p))
		} catch (error: any) {
			throw new Error(`Error retrieving profiles: ${error.message}`)
		}
	}

	// -----------------------------
	// UPDATE
	// -----------------------------
	async update(id: string, profile: Profile): Promise<Profile | null> {
		try {
			const updated = await ProfileModel.findByIdAndUpdate(
				id,
				{
					username: profile.getUsername(),
					email: profile.getEmail(),
					age: profile.getAge(),
					profile_image_url: profile.getProfileImageUrl(),
					allows_browser_notifications: profile.getAllowsBrowserNotifications(),
					allows_email_notifications: profile.getAllowsEmailNotifications(),
					allows_sms_notifications: profile.getAllowsSmsNotifications(),
					allows_geolocation: profile.getAllowsGeolocation()
				},
				{ new: true } // return updated document
			)

			return updated ? this.profileMapper.toDomain(updated) : null
		} catch (error: any) {
			throw new Error(`Error updating profile: ${error.message}`)
		}
	}

	// -----------------------------
	// HARD DELETE
	// -----------------------------
	async delete(id: string): Promise<boolean> {
		try {
			const result = await ProfileModel.findByIdAndDelete(id)
			return result !== null
		} catch (error: any) {
			throw new Error(`Error deleting profile: ${error.message}`)
		}
	}
}
