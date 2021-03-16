import Knex = require("knex")

const createdAt = (knex: Knex, table: Knex.TableBuilder) => table.timestamp('createdAt', { precision: 3 })
  .notNullable()
  .defaultTo(knex.fn.now(3));

const updatedAt = (knex: Knex, table: Knex.TableBuilder) => table.timestamp('updatedAt', { precision: 3 })
  .notNullable()
  .defaultTo(knex.raw('CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)'));

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('test', (t) => {
    t.bigIncrements('id').primary();
    t.string('value').unique().notNullable();
    createdAt(knex, t);
    updatedAt(knex, t);
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('test');
}

