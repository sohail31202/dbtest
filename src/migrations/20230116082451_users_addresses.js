/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('users_addresses', function(table) {
        table.increments('id');
        table.integer('user_id', 10).unsigned();
        table.tinyint('address_type', 1).defaultTo('1').comment("1:user address, 2:shipping address");
        table.string('address', 250);
        table.string('city', 50);
        table.string('state', 50);
        table.string('state_code', 3);
        table.string('country', 50);
        table.string('country_code', 3);
        table.string('pin_code', 10);
        table.decimal('latitude', 11, 8);
        table.decimal('longitude', 11, 8);
        table.datetime('created_at');
        table.datetime('updated_at');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropSchema('users_addresses');
};
