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

// Un-checked parent origin
const _addEventListener = addEventListener;
addEventListener = (...args) => {
  if (args[0] === 'message' && typeof args[1] === 'function') {
    const _listener = args[1];
    args[1] = (...eArgs) => {
      const {data, source} = eArgs[0];
      if (source === parent) {
        eArgs[0] = {
          origin: '*', // Ignore origin check
          data, source
        };
      }
      return _listener.apply(window, eArgs);
    };
  }
  return _addEventListener.apply(window, args);
};

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
