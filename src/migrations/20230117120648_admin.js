/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('admin', function(table){
    table.increments('id').comment('primary key');
    table.string('fullname', 30).defaultTo(null);
    table.string('email',100).defaultTo(null);
    table.string('phone_country_code', 5).defaultTo(null);
    table.string('phone_number', 20);
    table.string('password',100).comment("encrypeted password");
    table.datetime('created_at');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropSchema('admin');
};
