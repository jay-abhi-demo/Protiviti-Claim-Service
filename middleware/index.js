'use strict';
const errorHandler = require('./error');
const auth = require('./auth');
const asyncHandler = require('./async');
const advancedResults = require('./advancedResults');
const notFoundHandler = require('./notFoundHandler');

module.exports = {
  errorHandler,
  auth,
  asyncHandler,
  advancedResults,
  notFoundHandler,
};
