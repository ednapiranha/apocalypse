/* eslint-env node */

'use strict';

const Hapi = require('hapi');
const http = require('http');
const SocketIO = require('socket.io');
const Inert = require('inert');
const Blankie = require('blankie');
const Scooter = require('scooter');

const conf = require('./lib/conf');

const services = require('./lib/services');

const server = new Hapi.Server();

let io;
let users = 0;

server.connection({
  host: conf.get('domain'),
  port: conf.get('port')
});

server.ext('onPreResponse', (request, reply) => {
  let response = request.response;

  if (!response.isBoom) {
    return reply.continue();
  }

  let error = response;
  let ctx = {};

  let message = error.output.payload.message;
  let statusCode = error.output.statusCode || 500;
  ctx.code = statusCode;
  ctx.httpMessage = http.STATUS_CODES[statusCode].toLowerCase();

  switch (statusCode) {
    case 404:
      ctx.reason = 'page not found';
      break;
    case 403:
      ctx.reason = 'forbidden';
      break;
    case 500:
      ctx.reason = 'something went wrong';
      break;
    default:
      break;
  }

  if (!process.env.NODE_ENV) {
    console.log('ERROR: ', (error.stack || error));
  }

  if (ctx.reason) {
    // Use actual message if supplied
    ctx.reason = message || ctx.reason;
    return reply.view('error', ctx).code(statusCode);
  }

  ctx.reason = message.replace(/\s/gi, '+');
  reply.redirect(request.path + '?err=' + ctx.reason);
});

server.register([
  {
    register: Inert
  },
  {
    register: require('vision')
  }
], (err) => {
  if (err) {
    console.log(err);
  }

  server.views({
    engines: {
      pug: require('pug')
    },
    isCached: process.env.node === 'production',
    path: __dirname + '/views',
    compileOptions: {
      pretty: true
    }
  });
});

server.register([Scooter,
  {
    register: Blankie,
    options: {
      defaultSrc: 'self',
      frameSrc: ['self'],
      connectSrc: ['ws:', 'wss:', 'self'],
      imgSrc: ['self', 'data:', 'http://www.google-analytics.com',
               'https://www.google-analytics.com'],
      scriptSrc: ['self', 'http://www.google-analytics.com',
                  'https://www.google-analytics.com',
                  'http://s.ytimg.com', 'https://s.ytimg.com'],
      styleSrc: ['self', 'unsafe-inline', '//brick.a.ssl.fastly.net',
                 'http://brick.a.ssl.fastly.net'],
      fontSrc: ['self', 'https://brick.a.ssl.fastly.net',
                'http://brick.a.ssl.fastly.net'],
      generateNonces: false
    }
  }
], (err) => {
  if (err) {
    throw err;
  }
});

const routes = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: services.home
    }
  }
];

server.route(routes);

server.route({
  path: '/{p*}',
  method: 'GET',
  handler: {
    directory: {
      path: './build',
      listing: false,
      index: false
    }
  }
});

server.start(function (err) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }

  io = SocketIO.listen(server.listener);

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      users--;

      if (users < 0) {
        users = 0;
      }

      io.sockets.emit('count', users);
    });

    socket.on('join', () => {
      users++;

      io.sockets.emit('count', users);
    });

    socket.on('message', (data) => {
      services.message(data);
    });
  });
});
