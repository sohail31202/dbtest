/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('users_commodities', function(table){
    table.increments('id').comment("primary key");
    table.integer('user_id',10).comment("FK->users.id");
    table.integer('commodity_id',10).comment("FK->commodities.id");
    table.double('total_quantity');
    table.string('quantity_unit',10).defaultTo('gram');
    table.datetime('updated_at');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropSchema('users_commodities');
};
