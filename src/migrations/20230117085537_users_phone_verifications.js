/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('users_phone_verifications', function(table) {
        table.increments('id');
        table.specificType('phone_dial_code', 'char(5)');
        table.string('phone_number', 20);  
        table.specificType('phone_verificaction_code', 'char(6)');
        table.specificType('messageResponse', 'text');
        table.datetime('codeSentAt');
        table.datetime('codeExpireAt');
        table.tinyint('is_closed', 1).defaultTo('0').comment("0:not closed, 1:closed");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropSchema('users_phone_verifications');
};
