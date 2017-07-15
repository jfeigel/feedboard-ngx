'use strict';

const config = require('../../config.json');
const app = require('../index').app;
const io = app.io;
const feeds = require('../models/feeds.js');

io.on('connection', (ctx, data) => {
  console.log('join event fired', data);
});

io.on('disconnect', (ctx, data) => {
  console.log('leave event fired', data);
});

io.on('bootstrap', async function bootstrap(ctx, data) {
  const results = await feeds.getItems(config.site.options.results_on_bootstrap);
  console.log(results);
  io.socket.emit('bootstrap', JSON.stringify(results));
});

module.exports.restart = () => {
  io.broadcast('restart', {
    time: config.site.options.time_to_wait_before_restart
  });
};

module.exports.update = (data) => {
  io.broadcast('update', data);
};
