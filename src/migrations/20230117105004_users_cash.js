/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('users_cash', function(table){
    table.increments('id').comment("primary key");
    table.integer('user_id',10).comment("FK->users.id");
    table.double('total_cash');
    table.string('cash_unit',10).defaultTo('usd');
    table.datetime('updated_at');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropSchema('users_cash');
};
