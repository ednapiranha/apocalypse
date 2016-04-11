'use strict';

const concat = require('concat-stream');

const db = require('./db').register('messages');

exports.recent = function (next) {
  let rs = db.createValueStream({
    gte: 'message!',
    lte: 'message!\xff',
    reverse: true,
    limit: 30
  });

  rs.pipe(concat((messages) => {
    return next(null, messages);
  }));

  rs.on('error', (err) => {
    next(err);
  });
};
