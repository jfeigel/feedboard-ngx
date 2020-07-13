'use strict';

const config = require('../config.json');

const serve = require('koa-static');
// Passport support
const session = require('koa-session2');
const bodyParser = require('koa-bodyparser');

const Koa = require('koa');
const app = new Koa();

// Sockets
const KoaSocket = require('koa-socket');
const io = new KoaSocket();
const r = require('rethinkdbdash')(config.site.db);

io.attach(app);

exports.app = app;

const rss = require('./controllers/rss');

// For all socket connections
require('./controllers/sockets');

// Trust proxy
app.proxy = true;

// Sessions
app.keys = [config.site.secret];
app.use(session());

// Body Parser
app.use(bodyParser());

app.use(async function response(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.app.emit('error', err, ctx);
    ctx.body = {
      error: true,
      message: String(err),
      api: ctx.state.api
    };
  }
});

require('./routes');

console.log(`${config.site.name} is now listening on port ${config.site.port}`);
app.listen(config.site.port);

rss.init();

process.on('SIGINT', () => {
  process.exit();
});
