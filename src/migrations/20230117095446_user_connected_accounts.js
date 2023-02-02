/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('user_connected_accounts', function(table) {
        table.increments('id').comment("primary key");
        table.integer('user_id', 10).comment("FK->users.id");
        table.string('social_key', 200);
        table.string('social_email', 100).defaultTo(null);
        table.tinyint('social_type', 1).comment("1:google, 2:facebook, 3:apple");
        table.datetime('created_at');
        table.datetime('updated_at').defaultTo(null);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.down = function(knex) {
    return knex.schema.dropSchema('user_connected_accounts');
  
};
