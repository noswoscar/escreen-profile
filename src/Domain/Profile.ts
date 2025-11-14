export class Profile {
	private id: string
	private username: string
	private email: string
	private age?: number
	private profile_image_url?: string
	private allows_browser_notifications?: boolean
	private allows_email_notifications?: boolean
	private allows_sms_notifications?: boolean
	private allows_geolocation?: boolean

	constructor(id: string, username: string, email: string) {
		this.id = id
		this.username = username
		this.email = email
	}

	// ID
	public getId(): string {
		return this.id
	}
	public setId(id: string): void {
		this.id = id
	}

	// Username
	public getUsername(): string {
		return this.username
	}
	public setUsername(username: string): void {
		this.username = username
	}

	// Email
	public getEmail(): string {
		return this.email
	}
	public setEmail(email: string): void {
		this.email = email
	}

	// Age
	public getAge(): number | undefined {
		return this.age
	}
	public setAge(age: number): void {
		this.age = age
	}

	// Profile Image URL
	public getProfileImageUrl(): string | undefined {
		return this.profile_image_url
	}
	public setProfileImageUrl(url: string): void {
		this.profile_image_url = url
	}

	// Browser Notifications
	public getAllowsBrowserNotifications(): boolean | undefined {
		return this.allows_browser_notifications
	}
	public setAllowsBrowserNotifications(allows: boolean): void {
		this.allows_browser_notifications = allows
	}

	// Email Notifications
	public getAllowsEmailNotifications(): boolean | undefined {
		return this.allows_email_notifications
	}
	public setAllowsEmailNotifications(allows: boolean): void {
		this.allows_email_notifications = allows
	}

	// SMS Notifications
	public getAllowsSmsNotifications(): boolean | undefined {
		return this.allows_sms_notifications
	}
	public setAllowsSmsNotifications(allows: boolean): void {
		this.allows_sms_notifications = allows
	}

	// Geolocation
	public getAllowsGeolocation(): boolean | undefined {
		return this.allows_geolocation
	}
	public setAllowsGeolocation(allows: boolean): void {
		this.allows_geolocation = allows
	}
}
