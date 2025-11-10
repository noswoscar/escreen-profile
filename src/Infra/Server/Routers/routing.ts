import type { Application } from 'express'
import baseRouter from './BaseRouter'
import { entityRouter } from './EntityRouter'

const routing = {
	setBaseRouting: (app: Application) => {
		app.use('/api', baseRouter)
	},
	setEntityRouting: (app: Application) => {
		app.use('/api/entity', entityRouter)
	}
}

export default routing
