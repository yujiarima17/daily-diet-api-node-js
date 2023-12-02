import { FastifyInstance} from "fastify";
import {knex} from '../database'
import { randomUUID } from "node:crypto";
import {z} from 'zod'
import {checkSessionIdExists} from '../middlewares/check-session-id-exists'

const userBodySchema = z.object({
    username:z.string(),
    password:z.string()
})


export async function usersRoutes(app:FastifyInstance){
    app.get('/',{preHandler:[checkSessionIdExists]},async(request,reply)=>{
           let sessionId = request.cookies.sessionId

           const user =await knex('users').where({session_id: sessionId }).select()
            return {user}
    })

  app.delete('/:id',async(request,reply)=>{

    const requestParamsSchema = z.object({
        id:z.string().uuid()
    })

    const {id}= requestParamsSchema.parse(request.params)
    await knex('users').where('id',id).del()
        // reset cookie
        reply.clearCookie('sessionId',{path: '/'})
        return reply.status(200).send()
    
  })
  app.post('/',async(request,reply)=>{

        const {username,password} = userBodySchema.parse(request.body)
        let sessionId = randomUUID()
        reply.cookie('sessionId',sessionId,{
                path:'/',
                maxAge:1000 * 60 * 60 * 24 * 7 // 7 days
            })
        await knex('users').insert({

            id:randomUUID(),
            username,
            password,
            session_id: sessionId  
        })
        return reply.status(201).send()

    })
}