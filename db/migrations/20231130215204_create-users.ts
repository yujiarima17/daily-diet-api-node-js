import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
      table.uuid('id').primary();
      table.string('description').notNullable();
      table.datetime('eat_time', { precision: 6 });
      table.uuid('user_id').notNullable(); // Chave estrangeira para a tabela 'users'
      table.foreign('user_id').references('id').inTable('users');
      table.boolean('is_in_diet').notNullable();
    });
  }
  

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}

