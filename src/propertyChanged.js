const raf = require('raf');

// propertyChagned(canvas, ['width', 'height'], (peventValues) => log('changed!'))
// Only primitives supported
module.exports = (obj, props, callback) => {

  const closure = props.map(key => () => obj[key]);
  const resolve = () => closure.map(getter => getter());

  var stop = false;
  var prevent = resolve();
  raf(function task() {
    if (stop) return;
    const current = resolve();
    if (!current.every((v, i) => v === prevent[i])) {
      callback(prevent);
    }
    prevent = current;
    raf(task);
  });

  return () => stop = true;
};
