import { Slider } from './slider.js';

window.onload = function () {
  var body = document.getElementsByTagName('body')[0];

  var container = document.getElementById('container');

  new Slider(container).setup({ loop: true });
}

