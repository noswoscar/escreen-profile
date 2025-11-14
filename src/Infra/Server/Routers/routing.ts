import type { Application } from 'express'
import baseRouter from './BaseRouter'
import { profileRouter } from './ProfileRouter'

const routing = {
	setBaseRouting: (app: Application) => {
		app.use('/api', baseRouter)
	},
	setEntityRouting: (app: Application) => {
		app.use('/api/entity', profileRouter)
	}
}

export default routing
