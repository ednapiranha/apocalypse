'use strict';

const level = require('level');
const conf = require('./conf');

let path = conf.get('db') || './db';

let dbs = {};
let options = {};

exports = module.exports = function db (key) {
  if (!dbs[key]) {
    throw new Error('Database not registered: ' + key);
  }
  return dbs[key];
};

exports.register = function (key, opt) {
  if (dbs[key]) {
    throw new Error('Database already registered: ' + key);
  }

  const dbPath = path + '/' + key;
  const db = level(dbPath, {
    createIfMissing: true,
    valueEncoding: 'json'
  });

  dbs[key] = db;
  options[key] = opt;

  return db;
};
