'use strict';

const config = require('../../config.json');
const app = require('../index').app;
const io = app.io;
const feeds = require('../models/feeds.js');
const rss = require('../models/rss.js');

io.on('connection', (ctx, data) => {
  console.log('join event fired', data);
});

io.on('disconnect', (ctx, data) => {
  console.log('leave event fired', data);
});

io.on('bootstrap', async function bootstrap(ctx, data) {
  let results = await feeds.getItems(config.site.options.results_on_bootstrap);
  try {
    if (config.site.rss && config.site.rss.length > 0) {
      const rss_results = await rss.getItems(config.site.options.results_on_bootstrap);
      results = results.concat(rss_results);
    }
  } catch (e) {
    console.log(`WARNING: ${e}`);
  } finally {
    io.socket.emit('bootstrap', JSON.stringify(results));
  }
});

module.exports.restart = () => {
  io.broadcast('restart', {
    time: config.site.options.time_to_wait_before_restart
  });
};

module.exports.update = (data) => {
  io.broadcast('update', data);
};
