const EventEmitter2 = require('eventemitter2');
const Postmate = require('postmate/build/postmate.min');

const propertyChanged = require('./propertyChanged');
const getComputedStyle = (elem) => elem.currentStyle || document.defaultView.getComputedStyle(elem);

const Hack = new EventEmitter2();


// Style
document.documentElement.style.height =
document.documentElement.style.width =
document.body.style.height =
document.body.style.width = '100%';
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';

// An abstract object/ Must implements "width" and "height" properties.
var view = getComputedStyle(document.body); // default
Object.defineProperty(Hack, 'view', {
  get: () => ({ width: parseInt(view.width, 10), height: parseInt(view.height, 10) }),
  set: (value) => {
    const old = view;
    view = value;
    Hack.emit('viewchange', old, value);
  }
});

// Utility/ Create primary canvas
Hack.createCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.margin = 0;
  canvas.style.padding = 0;
  document.body.appendChild(canvas);
  Hack.view = canvas;

  return canvas;
};


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
  size: () => Hack.view
});

handshake.then(parent => {
  Hack.parent = parent; // export to global

  // require
  loadAsync(parent.model.files);

  // resizing
  addEventListener('resize', () => parent.emit('resize', Hack.view));
  Hack.on('viewchange', () => parent.emit('resize', Hack.view));
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
    Hack.emit('load');
  });
}

// Export
window.Hack = Hack;
