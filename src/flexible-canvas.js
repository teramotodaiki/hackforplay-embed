const raf = require('raf'); // requestAnimationFrame shim

module.exports = (Hack) => {

  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  var _width = canvas.width = window.innerWidth;
  var _height = canvas.height = window.innerHeight;

  raf(function check () {
    if (_width !== canvas.width || _height !== canvas.height) {
      canvas.dispatchEvent(new Event('resize'));
    }
    _width = canvas.width;
    _height = canvas.height;
    raf(check);
  });

  return canvas;
};
