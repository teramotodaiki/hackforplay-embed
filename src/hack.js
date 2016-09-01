const EventTarget = require('event-target-shim');

const Hack = new EventTarget();

Hack.on = Hack.addEventListener; // synonym

const channel = new MessageChannel();

channel.port1.onmessage = (event) => {
  Hack.dispatchEvent(event);
  if (event.data.method) {
    const partialEvent = new Event(event.data.method + '.message');
    partialEvent.data = event.data;
    Hack.dispatchEvent(partialEvent);
  }
};
Hack.postMessage = channel.port1.postMessage;

// require
Hack.on('require.message', (event) => {

  (callback => {
    // dependencies
    requirejs(event.dependencies || [], callback);

  })(() => {
    // main script
    const script = new Blob([
      `define(function (require, exports, module) {
        ${event.data.code || ''}
      });`
    ]);
    requirejs([window.URL.createObjectURL(script)], () => {
      // resolved
      Hack.dispatchEvent(new Event('load'));
    });

  });

});

window.parent.postMessage('ping', '*', [channel.port2]);

// Export
window.Hack = Hack;
