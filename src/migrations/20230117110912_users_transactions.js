/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
  .createTable('users_transactions', function(table){
    table.increments('id').comment("primary key");
    table.integer('user_id',10).comment("FK->users.id");
    table.tinyint('transaction_type',1).comment("1:add_commodity, 2:send_commodity, 3:received_commodity,4:withdraw_commodity, 5:add_cash, 6:withdraw_cash");
    table.integer('commodity_id',10).defaultTo(null);
    table.integer('sender_id',10).defaultTo(null);
    table.integer('receiver_id',10).defaultTo(null);
    table.double('quantity').defaultTo(null);
    table.string('quantity_unit',10).defaultTo(null);
    table.double('commodity_current_rate_in_gram').defaultTo(null);
    table.double('commodity_amount').defaultTo(null);
    table.string('commodity_amount_unit',10).defaultTo(null);
    table.double('cash').defaultTo(null);
    table.string('cash_unit',10).defaultTo(null);
    table.datetime('transaction_date');
    table.string('payment_method',50).defaultTo(null);
    table.string('payment_status',10).defaultTo(null);
    table.string('payment_json',1000).defaultTo(null);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropSchema('users_transactions');
};
