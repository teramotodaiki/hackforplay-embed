const EventTarget = require('event-target-shim');

const Hack = new EventTarget();

Hack.on = Hack.addEventListener; // synonym

// Style
document.documentElement.style.height =
document.documentElement.style.width =
document.body.style.height =
document.body.style.width = '100%';
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';

// Primary canvas
const canvas = require('./flexible-canvas')();
canvas.addEventListener('resize', () => {
  Hack.postMessage({
    method: 'resize',
    width: canvas.width,
    height: canvas.height
  });
});
document.body.appendChild(canvas);
Hack.canvas = canvas; // export as default

// Connect
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
