import { FastifyInstance } from "fastify";
import {knex} from '../database'
import {z} from 'zod'
import {checkSessionIdExists} from '../middlewares/check-session-id-exists'
interface MealProp{
    is_in_diet:number
  }
function bestSequence(mealsData : MealProp[]){
    let inDietNumberValue = 1
    let currentSequence :number[] = [];
    let longestSequence :number[]= [];
    
    for (const meal of mealsData) {
       if (meal.is_in_diet === 1) {
         currentSequence.push(meal.is_in_diet);
       } else {
         currentSequence = [];
       }

       if (currentSequence.length > longestSequence.length) {
         longestSequence = [...currentSequence];
       }
     }
     return longestSequence.length
}
async function getUserMetric(metric:string,sessionId:string){

  const userId = await knex('users').where({session_id:sessionId}).select()
  switch(metric){
    case('meals-total-amount'):

       const meals = await knex('meals').where({user_id:userId})
       const mealsAmount = meals.length
       return {meals_amount : mealsAmount}

    case ('meals-in-diet'):

        let inDietNumberValue = 1
        const mealsInDiet = await knex('meals').where({is_in_diet:inDietNumberValue,user_id:userId})
        const mealsInDietAmount = mealsInDiet.length
        return {meals_in_diet : mealsInDietAmount}

    case('meals-out-diet'):

       let outDietNumberValue = 0
       const mealsOutDiet = await knex('meals').where({is_in_diet:outDietNumberValue,user_id:userId})
       const mealsOutDietAmount = mealsOutDiet.length
       return {meals_out_diet : mealsOutDietAmount}

    case 'best-diet-sequence':
      
       const mealsData :MealProp[] = await knex('meals').where({ user_id: userId });
       const longestSequence = bestSequence(mealsData)
       return {best_sequence : longestSequence}

  }
}
export async function usersMetricsRoutes(app:FastifyInstance){
    app.get('/:id/:metric',{preHandler:checkSessionIdExists},async (request,reply)=>{
        const sessionId = request.cookies.sessionId
        const requestParamsSchema = z.object({
            id:z.string().uuid(),
            metric:z.string()
         })
         const {metric} = requestParamsSchema.parse(request.params)
         return getUserMetric(metric,sessionId!)

    })
}