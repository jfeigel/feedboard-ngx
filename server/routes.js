'use strict';

const config = require('../config.json');

const app = require('./index.js').app;
const Router = require('koa-router');

const routes = new Router();

const feeds = require('./controllers/feeds.js');

routes.post('/feeds/:provider', feeds.process);

app.use(routes.middleware());
