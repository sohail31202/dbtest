/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('app_static_page_content').del()
  await knex('app_static_page_content').insert([
    {page_type: 'about_us', page_content: ''},
    {page_type: 'term_and_condition', page_content: ''}
  ]);
};