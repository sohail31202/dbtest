/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('app_metadata').del()
  await knex('app_metadata').insert([
    {data_ref_key: "profile_intention", value_code: "1", value_desc: "Relationship", display_order: "1"},
    {data_ref_key: "profile_intention", value_code: "2", value_desc: "Dating", display_order: "2"},
    {data_ref_key: "profile_intention", value_code: "3", value_desc: "Friendship", display_order: "3"},
    {data_ref_key: "profile_intention", value_code: "4", value_desc: "Anything", display_order: "4"},
    {data_ref_key: "gender", value_code: "1", value_desc: "Male", display_order: "1"},
    {data_ref_key: "gender", value_code: "2", value_desc: "Female", display_order: "2"},
    {data_ref_key: "gender", value_code: "3", value_desc: "Others", display_order: "3"},
  ]);
};
