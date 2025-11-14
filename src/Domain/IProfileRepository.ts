import { Profile } from './Profile'

export interface IProfileRepository {
	create(profile: Profile): Promise<Profile>
	delete(id: string): Promise<boolean>
}
