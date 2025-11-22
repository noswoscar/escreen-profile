export class CreateProfileDTO {
	id!: string
	username!: string
	email!: string

	age?: number
	profile_image_url?: string

	allows_browser_notifications?: boolean
	allows_email_notifications?: boolean
	allows_sms_notifications?: boolean
	allows_geolocation?: boolean

	constructor(props: CreateProfileDTO) {
		Object.assign(this, props)
	}
}
