import fastify from "fastify";
import cookie from '@fastify/cookie'
import {usersRoutes} from './routes/users'
import {mealsRoutes} from './routes/meals'
import {usersMetricsRoutes} from './routes/users-metrics'
export const app = fastify()
app.register(cookie)
app.register(usersRoutes,{
    prefix:'users'
})
app.register(usersMetricsRoutes,{
    prefix:'users/metrics'
})
app.register(mealsRoutes,{
    prefix:'meals'
})