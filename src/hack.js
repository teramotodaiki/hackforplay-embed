const EventTarget = require('event-target-shim');

const Hack = new EventTarget();

requirejs(['some_mod'], function (mod) {
  mod();
});

const channel = new MessageChannel();

channel.port1.onmessage = (event) => {
  Hack.dispatchEvent(event);
  if (event.data.method) {
    const partialEvent = new Event(event.data.method + '.message');
    partialEvent.data = event.data;
    Hack.dispatchEvent(partialEvent);
  }
};

window.parent.postMessage('ping', '*', [channel.port2]);

// Export
window.Hack = Hack;
