'use strict';

const config = require('../../config.json');

const r = require('rethinkdbdash')(config.site.db);
const moment = require('moment');

const plugins = {};
for (const plugin of config.site.plugins) {
  plugins[plugin] = require(`./plugins/${plugin}`);
}

module.exports.process = async function process(provider, header, data) {
  if (!plugins[provider]) {
    return {error: true, message: 'Provider not supported'};
  }

  let result = plugins[provider].process(header, data);
  result.provider = provider;
  if (result.error === false) {
    result = await createActivity(result);
  }

  return result;
};

module.exports.getItems = async function getItems(limit) {
  return await getRecentActivities(limit);
};

async function createActivity(activity) {
  activity.timestamp = moment().valueOf();
  const result = await r.table('activity')
    .insert(activity, {returnChanges: true});
  return result.changes[0].new_val;
}

async function getActivity(id) {
  const result = await r.table('activity')
    .get(id);
  if (result === null) {
    throw new Error('Activity not found / feedModel.getActivity');
  }

  return result;
}

async function getRecentActivities(limit) {
  const results = await r.table('activity')
    .orderBy({index: r.desc('timestamp')})
    .limit(limit);

  if (results === null) {
    throw new Error('Activity not found / feedmModel.getRecentActivities');
  }

  return results;
}
