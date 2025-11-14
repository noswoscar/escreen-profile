import type { Application } from 'express'
import { profileRouter } from '../App/Routers/ProfileRouter'
import baseRouter from './Routers/BaseRouter'

const routing = {
	setBaseRouting: (app: Application) => {
		app.use('/api', baseRouter)
	},
	setEntityRouting: (app: Application) => {
		app.use('/api/entity', profileRouter)
	}
}

export default routing
