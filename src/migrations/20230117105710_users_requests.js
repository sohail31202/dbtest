/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('users_requests', function(table){
    table.increments('id').comment("primary key");
    table.integer('request_by',10).comment("FK->users.id");
    table.integer('request_to',10).comment("FK->users.id");
    table.integer('request_commodity_id',10);
    table.double('request_commodity_quantity');
    table.string('quantity_unit',10).defaultTo('gram');
    table.tinyint('request_status',1).comment("0:decline, 1:accept, 3:cancel");
    table.datetime('actioned_at').comment("if accepted/decline");
    table.datetime('requested_at');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropSchema('users_requests')
  
};
