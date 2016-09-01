const EventTarget = require('event-target-shim');

const Hack = new EventTarget();

requirejs(['some_mod'], function (mod) {
  mod();
});

const channel = new MessageChannel();

channel.port1.onmessage = (event) => {
  console.log(event.data); // pong
  channel.port1.postMessage('connected!');
};

window.parent.postMessage('ping', '*', [channel.port2]);

// Export
window.Hack = Hack;
