// eslint-disable-next-line
import {Knex} from 'knex'

declare module 'knex/type/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      session_id?: string
    }
    meals: {
      id: string
      description: string
      eat_time: string
      user_id: string
      is_in_diet: boolean
    }
  }
}
