import {app} from './app'
import {env} from './env'
import {knex} from './database'
app.listen({
    port:env.PORT
}).then(()=>{
    console.log('HTTP Server Running PORT : '+env.PORT)
})
app.get('/create',async()=>{
    const tables =await knex('sqlite_schema').select('*')
    return tables
})