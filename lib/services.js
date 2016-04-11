'use strict';

const conf = require('./conf');

const messages = require('./messages');

let ctx = {
  analytics: conf.get('analytics'),
  uid: false
};

let setContext = function (request) {
  ctx.error = request.query.err || '';
  ctx.message = request.query.message || '';
};

exports.home = function (request, reply) {
  setContext(request);

  messages.recent((err, messages) => {
    if (!err && messages) {
      ctx.messages = messages;
    } else {
      ctx.messages = [];
    }

    reply.view('index', ctx);
  });
};
