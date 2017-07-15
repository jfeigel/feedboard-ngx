'use strict';

const config = require('../../config.json');

const model = require('../models/feeds.js');
const socket = require('./sockets');

module.exports.process = async function process(ctx, next) {
  ctx.state.api = true;
  // which plugin are they wanting to use?
  const provider = ctx.params.provider;
  if (config.site.plugins.indexOf(provider) === -1) {
    // they didn't pass a plugin that isn't supported
    ctx.body = {
      error: true,
      message: 'Provider not supported'
    };
    return await next();
  }
  // the plugin they are trying to use is available, let's send it over
  const result = await model.process(provider, ctx.request.header, ctx.request.body);
  // if there's an error, just return it
  if (result.error === true) {
    ctx.body = result;
    return await next();
  }
  // there wasn't an error, so send out a socket event
  socket.update(result);
  // check to see if this was feedboard updating itself
  if (result.plugin == 'feedboard' && result.type == 'update') {
    socket.restart();
  }
  ctx.body = result;
  return await next();
};
