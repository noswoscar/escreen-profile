import type { Application } from 'express'
import baseRouter from './Routers/BaseRouter'

const routing = {
	setBaseRouting: (app: Application) => {
		app.use('/api', baseRouter)
	}
}

export default routing
