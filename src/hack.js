
requirejs(['some_mod'], function (mod) {
  mod();
});

document.querySelector('body').innerHTML = 'HACK!';
