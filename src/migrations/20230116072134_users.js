/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable('users', function(table) {
        table.increments('id');
        table.string('fullname', 30);
        table.specificType('phone_dial_code', 'char(5)');
        table.string('phone_number', 20);  
        table.string('email', 100);
        table.string('password', 100);
        table.tinyint('signup_type', 1).defaultTo('1').comment("1:normal, 2:social");
        table.date('dob').defaultTo(null);
        table.tinyint('age',4).defaultTo(null);
        table.string('device_id', 100).comment("unique device id");
        table.string('device_token',500).comment("FCM token use from notification");
        table.tinyint('device_type', 1).comment("1:Android,2:IOS, 3:Web");
        table.string('ssn_number', 20);
        table.string('transaction_pin', 100);
        table.tinyint('notification_enable', 1).defaultTo('1').comment("1:enable, 0:disable");
        table.string('user_qr_code_filename', 100);
        table.string('profile_img',50);
        table.boolean('is_img_url').defaultTo(0).comment('0:No, 1:Yes');
        table.tinyint('status', 1).defaultTo('1').comment("0:inactive, 1:active");
        table.tinyint('is_deleted', 1).defaultTo('0').comment("0:not deleted, 1:deletede");
        table.datetime('deleted_at');
        table.datetime('created_at');
        table.datetime('updated_at');
        table.tinyint('is_phone_verified', 1).defaultTo('0').comment("0:no, 1:yes");
        table.tinyint('is_registration_completed', 1).defaultTo('0').comment("0:no, 1:yes");
        table.tinyint('is_password_created', 1).defaultTo('0').comment("0:no, 1:yes");
        table.tinyint('is_pin_created', 1).defaultTo('0').comment("0:no, 1:yes");
        table.tinyint('both_address_same_chk', 1).defaultTo('0').comment("0:no, 1:yes");
        table.string('unique_invitation_code', 10);
        table.string('joined_with_invitation_code', 10);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropSchema('users');
};
