import {config} from 'dotenv'
import {z} from 'zod'
if(process.env.NODE_ENV === 'test'){
    config({path:'.env.test',override:true})
}else{
    config()
}

const envSchema = z.object({
    DATABASE_URL:z.string(),
    NODE_ENV:z.enum(['development','test','production']).default('production'),
    PORT: z.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if(_env.success ===false){
  throw new Error('Invalid environment variables.')
}
export const env = _env.data