const EventTarget = require('event-target-shim');
const Postmate = require('postmate/build/postmate.min');

const propertyChanged = require('./propertyChanged');

const Hack = new EventTarget();

Hack.on = Hack.addEventListener; // synonym

// Event will call only once
Hack.once = (name, handler, config) => Hack.on(name, function task(...eventArgs) {
  handler.apply(this, eventArgs);
  Hack.removeEventListener(name, task);
}, config);

// Style
document.documentElement.style.height =
document.documentElement.style.width =
document.body.style.height =
document.body.style.width = '100%';
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';

// Primary canvas
var canvas = document.createElement('canvas'); // default
canvas.style.width = canvas.style.height = '100%';
document.body.appendChild(canvas);

// When primary canvas unregistered
Hack.once('canvaschange', () => canvas.parentNode.removeChild(canvas));

// Should use
Hack.setCanvas = (canvas) => {
  Hack.canvas = canvas;

  const emit = ({width, height}) => Hack.parent && Hack.parent.emit('resize', {width, height});
  const stop = propertyChanged(canvas, ['width', 'height'], () => emit(canvas));
  Hack.once('canvaschange', stop);

  canvas.style.width = '100%';
  canvas.style.height = '100%';
  emit(canvas);
};

Object.defineProperty(Hack, 'canvas', {
  configurable: true, enumerable: true,
  get: () => canvas,
  set: (replace) => {
    Hack.dispatchEvent(new Event('canvaschange'));
    canvas = replace;
  }
});


// Un-checked parent origin
const _addEventListener = addEventListener;
window.addEventListener = (...args) => {
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
  loadAsync(parent.model.files);
});

function loadAsync(files) {
  const paths = files.map(({name, code = ''}) => {
    const script = new Blob([`define(function (require, exports, module) {${code}});`]);
    return { [name]: URL.createObjectURL(script) };
  });

  const config = {
    // alias
    map: { '*': Object.assign.apply(null, [].concat(paths)) }
  };

  // config, deps, callback
  requirejs(config, [files[0].name], () => {
    Hack.dispatchEvent(new Event('load'));
  });
}

// Export
window.Hack = Hack;
