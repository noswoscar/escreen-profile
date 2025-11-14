import { Types } from 'mongoose'
import { Profile } from './Profile'

export interface IProfileRepository {
	create(profile: Profile): Promise<Profile>
	delete(id: Types.ObjectId): Promise<boolean>
}
