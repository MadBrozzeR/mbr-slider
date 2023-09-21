import { Slider } from '../slider.js';

window.onload = function () {
  var body = document.getElementsByTagName('body')[0];

  var container = document.getElementById('container');

  var highlighted;

  new Slider(container).on({
    touchMove: function (event, touch) {
      var relativeShift = this.getRelativeShift(touch);
      var prev = this.prev();
      var next = this.next();
      var current = this.current();

      if (relativeShift.dx > 0.4) {
        if (highlighted !== prev) {
          highlighted && highlighted.element.removeAttribute('data-slider-highlighted');
          highlighted = prev;
          highlighted.element.setAttribute('data-slider-highlighted', 'true');
        }
      } else if (relativeShift.dx < -0.4) {
        if (highlighted !== next) {
          highlighted && highlighted.element.removeAttribute('data-slider-highlighted');
          highlighted = next;
          highlighted.element.setAttribute('data-slider-highlighted', 'true');
        }
      } else if (highlighted !== current) {
        highlighted && highlighted.element.removeAttribute('data-slider-highlighted');
        highlighted = current;
        highlighted.element.setAttribute('data-slider-highlighted', 'true');
      }

      Slider.DEFAULT_LISTENERS.touchMove.call(this, event, touch);
    }
  });
}

