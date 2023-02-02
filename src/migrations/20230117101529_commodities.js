/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('commodities', function(table) {
        table.increments('id').comment("primary key");
        table.string('commodity_type',50);
        table.string('name',50);
        table.string('icon_image',100);
        table.double('current_rate');
        table.double('old_rate').defaultTo(null);
        table.string('change_amount',20).defaultTo(null);
        table.string('change_percent',20).defaultTo(null);
        table.tinyint('amount_up_down_ind',1).defaultTo(null).comment("0:no change, 1:up, 2:down");
        table.datetime('updated_at').defaultTo(null);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropSchema('commodities');
  
};
