/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('app_metadata', function(table){
    table.increments('id').comment('primary key');
    table.string('data_ref_key',50);
    table.string('value_code', 50);
    table.string('value_desc', 255);
    table.string('additional_data', 500).defaultTo(null);
    table.tinyint('status', 1).defaultTo(1).comment("0:inactive, 1:active");
    table.integer('display_order', 1);
    table.datetime('created_at');
    table.integer('created_by', 10);
    table.datetime('updated_at').defaultTo(null);
    table.integer('updated_by',10).defaultTo(null);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropSchema('app_metadata');
};
