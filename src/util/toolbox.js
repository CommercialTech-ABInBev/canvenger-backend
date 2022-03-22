/* eslint-disable eqeqeq */
/* eslint-disable valid-jsdoc */
/* eslint-disable linebreak-style */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import joi from '@hapi/joi';
import moment from 'moment';
import env from '../config/env';
import ApiError from './apiError';

const { SECRET, PORT } = env;
/**
 * function objectfor api tools methods
 *
 * @function Toolbox
 */
const Toolbox = {
  /**
   * Synchronously sign the given payload into a JSON Web Token string.
   * @function
   * @param {string | number | Buffer | object} payload Payload to sign.
   * @param {string | number} expiresIn Expressed in seconds or a string describing a
   * time span. Eg: 60, "2 days", "10h", "7d". Default specified is 1day.
   * @returns {string} JWT token.
   * @memberof Toolbox
   */
  createToken(payload, expiresIn = '1hr') {
    return jwt.sign(payload, SECRET, { expiresIn });
  },

  /**
   * Synchronously sign the given payload into a JSON Web Token string that never expires.
   * @function
   * @param {string | number | Buffer | object} payload Payload to sign.
   * @returns {string} JWT token.
   * @memberof Toolbox
   */
  createEternalToken(payload) {
    return jwt.sign(payload, SECRET);
  },

  /**
   * Synchronously verify the given JWT token using a secret
   * @function
   * @param {*} token - JWT token.
   * @returns {string | number | Buffer | object } - Decoded JWT payload if
   * token is valid or an error message if otherwise.
   * @memberof Toolbox
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch (err) {
      throw new ApiError(400, 'Invalid Token');
    }
  },

  /**
   * Hashes a password
   * @function
   * @param {string} password - Password to encrypt.
   * @returns {string} - Encrypted password.
   * @memberof Toolbox
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },

  /**
   * Compares a password with a given hash
   * @function
   * @param {string} password - Plain text password.
   * @param {string} hash - Encrypted password.
   * @returns {boolean} - returns true if there is a match and false otherwise.
   * @memberof Toolbox
   */
  comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  },

  /**
   * Generates a JSON response for success scenarios.
   * @function
   * @param {Response} res - Response object.
   * @param {object} data - The payload.
   * @param {number} code -  HTTP Status code.
   * @returns {JSON} - A JSON success response.
   * @memberof Toolbox
   */
  successResponse(res, data, code = 200) {
    return res.status(code).json({
      status: 'success',
      data
    });
  },

  /**
   * Generates a JSON response for failure scenarios.
   * @function
   * @param {Response} res - Response object.
   * @param {object} options - The payload.
   * @param {number} options.code -  HTTP Status code, default is 500.
   * @param {string} options.message -  Error message.
   * @param {object|array  } options.errors -  A collection of  error message.
   * @returns {JSON} - A JSON failure response.
   * @memberof Toolbox
   */
  errorResponse(res, { code = 500, message = 'Some error occurred while processing your Request', errors }) {
    return res.status(code).json({
      status: 'fail',
      error: {
        message,
        errors
      }
    });
  },

  /**
   * Generates email verification link
   * @function
   * @param { Request } req - Request object
   * @param { string } id - User's unique ID.
   * @param { string } email - User's email.
   * @returns {URL} - Verification link.
   * @memberof Toolbox
   */
  createVerificationLink(req, { id, email }) {
    const token = Toolbox.createToken({ id, email });
    const host = req.hostname === 'localhost' ? `${req.hostname}:${PORT}` : req.hostname;
    return `${req.protocol}://${host}/v1.0/api/auth/verify?token=${token}`;
  },

  /**
   * Generates email password reset link
   * @function
   * @param {*} req
   * @param {*} id
   * @param {*} email
   * @returns {URL} - password reset link
   * @memberof Toolbox
   */
  createPasswordResetLink(req, {
    id, email, verified, roleId
  }) {
    const token = Toolbox.createToken({
      id, email, verified, roleId
    }, '5h');
    return `${req.protocol}://${req.get('host')}/v1.0/api/auth/reset-password/email?token=${token}`;
  },

  /**
   * Validates a value using the given Joi schema
   * @function
   * @param {object} value
   * @param {Joi.SchemaLike} schema
   * @returns {Promise} Validation result
   * @memberof Toolbox
   */
  validate(value, schema) {
    return joi.validate(value, schema, { abortEarly: false, allowUnknown: true });
  },

  /**
   * Checks token from request header for user authentication
   * @function
   * @param {object} req - The request from the endpoint
   * @returns {Token} Token
   * @memberof Toolbox
   */
  checkToken(req) {
    const {
      headers: { authorization },
      cookies: { token: cookieToken }
    } = req;
    let bearerToken = null;
    if (authorization) {
      bearerToken = authorization.split(' ')[1]
        ? authorization.split(' ')[1] : authorization;
    }
    return cookieToken || bearerToken || req.headers['x-access-token'] || req.headers.token || req.body.token;
  },

  /**
   * Extracts Array Records from sequelize object.
   * @function
   * @param {array} dataArray - An array of unformatted records.
   * @returns { array } - An array containing formatted records.
   * @memberof Toolbox
   */
  extractArrayRecords(dataArray) {
    return dataArray.map(({ dataValues }) => dataValues);
  },

  /**
   * Adds new properties to the items of a collection.
   * @async
   * @param {array} collection - An array of objects.
   * @param {object} options - An object with properties to be added to the items of a collection.
   * @returns {Promise<Array>} A promise object with an updated collection.
   * @memberof Toolbox
   */
  async updateCollection(collection, options) {
    return collection.map((item) => {
      const newItem = { ...item, ...options };
      return newItem;
    });
  },

  /**
   * match id input array with equivalent item ids in database.
   * @function
   * @param {array} items - item array with ids
   * @param {array} databaseItems = databaese items array with equivalent values
   * @returns {boolean} true if all input items match items in database, false if not
   * @memberof Toolbox
   */
  matchIds(items, databaseItems) {
    let allItemsMatch = true;
    items.forEach((id) => {
      const match = databaseItems.find((databaseValue) => databaseValue.id === id);
      if (match === undefined) allItemsMatch = false;
    });
    return allItemsMatch;
  },

  /**
   * remove duplicate datas.
   * @function
   * @param {array} incomingData - item array with ids
   * @param {array} databaseItems = databaese items array with equivalent values
   * @param {array} users = databaese items array with equivalent values
   * @returns {boolean} true if all input items match items in database, false if not
   * @memberof Toolbox
   */
  checkDataArray(incomingUsers, databaseItems) {
    incomingUsers.forEach((item, i) => {
      if (item.email === '') incomingUsers.splice(i, 1);
      const checkIndex = databaseItems.findIndex(({ email }) => item.email === email);
      if (checkIndex < 0) incomingUsers.splice(checkIndex, 1);
    });
    return incomingUsers;
  },

  /**
   * generates image reference code
   * @static
   * @param {object} image - supplierId
   * @returns {string} reference - A unique value for ref
   * @memberof Toolbox
   */
  generateReference(image) {
    const randomNumber = Math.floor(Math.random() * 8999 + 1000);
    const anotherRandomNumber = Math.floor(Math.random() * 8999 + 1000);
    const reference = `${image}${randomNumber}${anotherRandomNumber}`;
    return reference;
  },

  /**
   * refactor excel array
   * @static
   * @param {object} orders
   * @returns {string} reference - A unique value for ref
   * @memberof Toolbox
   */
  excelSheetReport(orders) {
    const result = [];

    orders.forEach((obj) => {
      const products = [];
      obj.products.forEach((x) => products.push(`${x.ProductOrder.quantity} ${x.name}-(${x.unitPack})`));
      result.push({
        order_reference: obj.orderRef,
        bulkbreaker: obj.bulkbreakers.bulkbreaker,
        bulkbreaker_code: obj.bulkbreakers.bulkbreakerCode,
        cic_agent: obj.cic.fullName,
        supervisor: obj.bulkbreakers.supervisor,
        products: products.join(', '),
        orderStatus: obj.orderStatus === null ? 'pending' : obj.orderStatus,
        order_date: moment(obj.createdAt).format('l'),
        delivery_date: moment(obj.deliveryDate).format('l'),
        paymentMode: obj.paymentMode,
        note: obj.note,
      });
    });

    return result;
  },
};

export default Toolbox;
