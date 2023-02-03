/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('app_static_page_content', function(table){
    table.increments('id').comment("primary key");
    table.string('page_type', 50).comment("ex:- privacy_policy/term_and_condition");
    table.longtext('page_content');
    table.tinyint('status',1).defaultTo(1).comment("0:inactive, 1:active");
    table.datetime('created_at');
    table.integer('created_by',10);
    table.datetime('updated_at');
    table.integer('updated_by',10);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropSchema('app_static_page_content');
};
