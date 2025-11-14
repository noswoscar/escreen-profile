import { Request, Response } from 'express'
import logger from '../../Infra/Logger/WinstonLogger'
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
