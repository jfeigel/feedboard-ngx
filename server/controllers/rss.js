'use strict';

const config = require('../../config.json');

const model = require('../models/rss.js');

module.exports.init = async function init(limit) {
  await model.init(limit);
};
