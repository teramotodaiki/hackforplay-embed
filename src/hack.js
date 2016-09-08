const EventTarget = require('event-target-shim');
const Postmate = require('postmate/build/postmate.min');

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
  Hack.parent.emit('resize', {
    width: canvas.width,
    height: canvas.height
  });
});
document.body.appendChild(canvas);
Hack.canvas = canvas; // export as default


// Connect
const handshake = new Postmate.Model({
  size: () => ({ width: canvas.width, height: canvas.height })
});

handshake.then(parent => {
  Hack.parent = parent; // export to global

  // require
  loadAsync(parent.model.file);
});

function loadAsync({dependencies, code}) {
  (callback => {
    // dependencies
    requirejs(dependencies || [], callback);

  })(() => {
    // main script
    const script = new Blob([
      `define(function (require, exports, module) {
        ${code || ''}
      });`
    ]);
    requirejs([window.URL.createObjectURL(script)], () => {
      // resolved
      Hack.dispatchEvent(new Event('load'));
    });

  });
}

// Export
window.Hack = Hack;
