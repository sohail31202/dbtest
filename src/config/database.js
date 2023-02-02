import knexJs from "knex";
import knexConfig from "./knexfile";

/**
 * Knex connection with our database configuration
*/

const knex = knexJs( knexConfig );

module.exports = { knex  };