/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {fullname: "Saferr Admin", email: "admin@gmail.com", password:"$2a$10$S9/fuQj09pRrEVJvdg4A2eSA1NH7iQI0p4BsZa3cNd/HPlOr4E2dm", user_type: "1", gender: "1", intention: "4", is_email_verify: "1"}
  ]);
};