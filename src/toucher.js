function Toucher (container, listeners) {
  this.container = container;
  this.listeners = {};
  this.touches = [];

  var toucher = this;

  container.addEventListener('touchstart', function (event) {
    for (var index = 0 ; index < event.changedTouches.length ; ++index) {
      toucher.touches[index] = {
        x: event.changedTouches[index].clientX,
        y: event.changedTouches[index].clientY,
        dx: 0,
        dy: 0
      };
    }
    toucher.listeners.start && toucher.listeners.start.call(toucher, toucher.touches, event);
  }, { passive: false });

  container.addEventListener('touchmove', function (event) {
    for (var index = 0 ; index < event.changedTouches.length ; ++index) {
      toucher.touches[index].dx = event.changedTouches[index].clientX - toucher.touches[index].x;
      toucher.touches[index].dy = event.changedTouches[index].clientY - toucher.touches[index].y;
    }
    toucher.listeners.move && toucher.listeners.move.call(toucher, toucher.touches, event);
  }, { passive: false });

  container.addEventListener('touchend', function (event) {
    toucher.listeners.end && toucher.listeners.end.call(toucher, toucher.touches, event);
  }, { passive: false });
}

Toucher.prototype.on = function (listeners) {
  listeners.start && (this.listeners.start = listeners.start);
  listeners.move && (this.listeners.move = listeners.move);
  listeners.end && (this.listeners.end = listeners.end);
}

Toucher.attach = function (element, listeners) {
  var toucher = new Toucher(element);

  listeners && toucher.on(listeners);

  return toucher;
}

export { Toucher };
