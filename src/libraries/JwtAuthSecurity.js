 import jwt from "jsonwebtoken";
 import {
     bcrypt
 } from "bcryptjs";

 // const jwt = require('jsonwebtoken');
 export default class JwtAuthSecurity {

     /**
      * generate jwt token 
      *
      * @param {object} user  param
      * @returns {string} jwt token
      */
     static generateJwtToken(user) {

         /* get jwt to expire time from env file*/
         const expiresIn = process.env.JWT_EXPIRE_TIME;

         /* get jwt to secret key from env file*/
         const secretKey = process.env.JWT_SECRET_KEY;

         /* set conver user data */
         const userKeys = JSON.parse(JSON.stringify(user));

         /*generate jwt token */
         const token = jwt.sign(userKeys,
             secretKey, {
                 expiresIn
             }
         );

         /*return generate token */
         return token;

     }


 }