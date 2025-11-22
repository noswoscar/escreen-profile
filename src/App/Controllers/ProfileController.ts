import { Request, Response } from 'express'
import logger from '../../Infra/Logger/WinstonLogger'
import { CreateProfileDTO } from '../DTOS/CreateProfileDTO'
import { ProfileService } from '../Services/ProfileService'

export class ProfileController {
	private profileService: ProfileService

	// Service is passed down through constructor
	constructor(profileService: ProfileService) {
		this.profileService = profileService
	}

	// -----------------------------
	// CREATE PROFILE
	// -----------------------------
	createProfile = async (req: Request, res: Response): Promise<void> => {
		try {
			logger.info('Creating a new profile')

			const {
				id,
				username,
				email,
				age,
				profile_image_url,
				allows_browser_notifications,
				allows_email_notifications,
				allows_sms_notifications,
				allows_geolocation
			} = req.body

			const createdProfile = await this.profileService.createProfile({
				id,
				username,
				email,
				age,
				profile_image_url,
				allows_browser_notifications,
				allows_email_notifications,
				allows_sms_notifications,
				allows_geolocation
			})
			res.status(201).json({
				message: 'Profile created successfully',
				data: createdProfile
			})
		} catch (error) {
			res.status(500).json({
				message: 'Error creating profile',
				error: error instanceof Error ? error.message : 'Unknown error'
			})
		}
	}

	updateUserProfile = async (req: Request, res: Response) => {
		try {
			const userId = req.params.id
			const updatedProfile = req.body.profile

			if (!userId || !updatedProfile?.options) {
				return res.status(400).json({ message: 'Missing user ID or profile options' })
			}

			// Call service to update profile using the entity
			const profile = await this.profileService.updateProfile(userId, {
				allowsBrowserNotifications: updatedProfile.options.allows_browser_notifications,
				allowsEmailNotifications: updatedProfile.options.allows_email_notifications,
				allowsSmsNotifications: updatedProfile.options.allows_sms_notifications,
				allowsGeolocation: updatedProfile.options.allows_geolocation
			})

			if (!profile) {
				return res.status(404).json({ message: 'Profile not found' })
			}

			return res.status(200).json({ message: 'Profile updated successfully', profile })
		} catch (err: any) {
			console.error(`Error updating profile for ID=${req.params.id}:`, err)
			return res.status(500).json({ message: 'Could not update profile' })
		}
	}

	findOrCreateUserProfile = async (req: Request, res: Response) => {
		try {
			const profileId = req.params.id
			const { username, email } = req.body

			logger.info(`Finding or creating profile for ID=${profileId}, username=${username}`)

			if (!profileId) {
				return res.status(400).json({ message: 'Profile ID (param :id) is required' })
			}
			if (!username) {
				return res.status(400).json({ message: 'username is required' })
			}
			if (!email) {
				return res.status(400).json({ message: 'email is required' })
			}

			// Build DTO
			const dto: CreateProfileDTO = {
				id: profileId,
				username,
				email
			}

			const profile = await this.profileService.findOrCreateProfile(dto)
			return res.status(200).json({
				message: 'Profile retrieved or created successfully',
				profile
			})
		} catch (err: any) {
			logger.error(`Error finding/creating profile for ID=${req.params.id}: ${err?.message || err}`)
			return res.status(500).json({ message: 'Could not retrieve or create profile' })
		}
	}

	// -----------------------------
	// DELETE PROFILE
	// -----------------------------
	deleteProfile = async (req: Request, res: Response): Promise<void> => {
		try {
			const { id } = req.params
			logger.info(`Deleting profile with ID: ${id}`)

			const isDeleted = await this.profileService.deleteProfile(id)

			if (isDeleted) {
				res.status(200).json({ message: 'Profile deleted successfully' })
			} else {
				res.status(404).json({ message: 'Profile not found' })
			}
		} catch (error) {
			res.status(500).json({
				message: 'Error deleting profile',
				error: error instanceof Error ? error.message : 'Unknown error'
			})
		}
	}
}
