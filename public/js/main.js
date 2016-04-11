'use strict';

require('../css/shared.css');
require('../css/main.css');

const moment = require('moment');
const Fingerprint2 = require('fingerprintjs2');

let fp = false;

const ws = require('./ws');
const face = require('./face');

const socket = ws.getSocket();

let counter = document.querySelector('#counter');
let messages = document.querySelector('#messages');

face.generate();

function setTime() {
  return moment().format('LTS');
}

socket.on('connect', () => {
  new Fingerprint2().get((result) => {
    fp = result;

    socket.emit('join', {
      id: fp
    });
  });
});

socket.on('message', (data) => {
  let div = document.createElement('div');
  div.className = 'message';
  let time = document.createElement('time');
  time.textContent = setTime();
  div.appendChild(time);
  let p = document.createElement('p');
  p.textContent = data;
  div.appendChild(p);
  messages.appendChild(div);
});

socket.on('count', (data) => {
  let count = parseInt(data, 10);
  if (isNaN(count)) {
    count = 0;
  }

  counter.textContent = count;
});
