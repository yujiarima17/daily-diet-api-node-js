import { FastifyInstance } from "fastify";
import {knex} from '../database'

import {up,down} from '../../db/migrations/20231130215204_create-users'
import { randomUUID } from "node:crypto";
import {z} from 'zod'
import {checkSessionIdExists} from '../middlewares/check-session-id-exists'

const mealsBodySchema = z.object({
    description:z.string(),
    "is_in_diet":z.boolean().default(false),
    "eat_time":z.string()
    
})

export async function mealsRoutes(app:FastifyInstance){

    app.post('/',{preHandler:[checkSessionIdExists]},async (request,reply)=>{
       
        const {description,eat_time,is_in_diet} = mealsBodySchema.parse(request.body)
        let sessionId = request.cookies.sessionId
        const eatTimeDate = new Date(eat_time)
        const user_id = await knex('users').where('session_id',sessionId).select('id')
        await knex('meals').insert({
            id:randomUUID(),
            description,
            eat_time:eatTimeDate,
            is_in_diet,
            user_id
        })
        return reply.status(201).send()

    })
    app.get('/:id',{preHandler:[checkSessionIdExists]},async (request,reply)=>{
        
        const requestParamsSchema = z.object({
            id:z.string().uuid()
        })
        const {id} = requestParamsSchema.parse(request.params)
        const meal = await knex('meals').where({id}).first()
        return {meal}

    })
    app.get('/',{preHandler:[checkSessionIdExists]},async(request,reply)=>{

       const sessionId = request.cookies.sessionId
       const useId = await knex('users').where({session_id:sessionId}).select()
       const meals = await knex('meals').where({user_id:useId})
       console.log(useId)
       return {meals}

    })
    app.put('/:id',{preHandler:[checkSessionIdExists]},async (request,reply)=>{
        
        const requestParamsSchema = z.object({
            id:z.string().uuid()
        })

        const {id} = requestParamsSchema.parse(request.params)
        const requestBodySchema = z.object({
            description:z.string().optional(),
            "is_in_diet":z.boolean().optional(),
            "eat_time":z.string().optional()
        })

        const requestData = requestBodySchema.parse(request.body)

        if(requestData){

          const successUpdate = await knex('meals').where({id}).update(requestData,['id'])
          const replyCode = successUpdate ? 200 : 409
          return reply.status(replyCode).send()
        }
        return reply.status(400).send()
    })
    app.delete('/:id',{preHandler:[checkSessionIdExists]},async (request,reply)=>{
        const requestParamsSchema = z.object({
            id:z.string().uuid()
        })
        const {id} = requestParamsSchema.parse(request.params)
        await knex('users').where({id}).delete()
        return reply.status(200).send()
    })
}