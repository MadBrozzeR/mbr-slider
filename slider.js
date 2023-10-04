var DEFAULT_OPTIONS = {
  loop: false,
  threshold: 0.4,
};

var DEFAULT_LISTENERS = {
  touchStart: function (event) {
    this.container.setAttribute('data-slider-active', '1');
  },
  touchMove: function (event, touch) {
    event.preventDefault();

    var relativeShift = this.getRelativeShift(touch);

    this.container.style.setProperty('--shift-x', relativeShift.dx);
    this.container.style.setProperty('--shift-y', relativeShift.dy);
  },
  touchEnd: function (event, touch) {
    var relativeShift = this.getRelativeShift(touch);

    this.container.setAttribute('data-slider-active', '0');
    this.container.style.setProperty('--shift-x', 0);
    this.container.style.setProperty('--shift-y', 0);

    if (relativeShift.dx > this.options.threshold) {
      this.setCurrent(this.prev());
    } else if (relativeShift.dx < -this.options.threshold) {
      this.setCurrent(this.next());
    }
  },
  typeChange: function (type) {
    if (type) {
      this.element.setAttribute('data-slide-type', type);
    } else {
      this.element.removeAttribute('data-slide-type');
    }
  }
}

function Slide (element, slider) {
  this.slider = slider;
  this.element = element;
}
Slide.prototype.setType = function (type) {
  this.slider.emit('typeChange', this, [type]);
}

function touchListener (slider) {
  var touch = { x: 0, y: 0, dx: 0, dy: 0 };

  slider.container.addEventListener('touchstart', function (event) {
    touch.x = event.changedTouches[0].clientX;
    touch.y = event.changedTouches[0].clientY;
    touch.dx = touch.dy = 0;

    slider.emit('touchStart', slider, [event]);
  });

  slider.container.addEventListener('touchmove', function (event) {
    touch.dx = event.changedTouches[0].clientX - touch.x;
    touch.dy = event.changedTouches[0].clientY - touch.y;

    slider.emit('touchMove', slider, [event, touch]);
  });

  slider.container.addEventListener('touchend', function (event) {
    slider.emit('touchEnd', slider, [event, touch]);
  });
}

function Slider (container) {
  this.container = container;
  this.options = Object.assign({}, DEFAULT_OPTIONS);
  this.listeners = Object.assign({}, DEFAULT_LISTENERS);

  this.slides = this.getSlides();
  this.setCurrent(0);

  touchListener(this);
}
Slider.prototype.getRelativeShift = function (touch) {
  return {
    dx: (touch.dx || 0) / this.container.clientWidth,
    dy: (touch.dy || 0) / this.container.clientHeight,
  };
}
Slider.prototype.getSlides = function (className) {
  className || (className = 'slide');

  var result = [];

  for (var index = 0 ; index < this.container.children.length ; ++index) {
    if (this.container.children[index].className === className) {
      result.push(new Slide(this.container.children[index], this));
    }
  }

  return result;
}
Slider.prototype.push = function (element) {
  if (element instanceof HTMLElement) {
    this.slides.push(new Slide(element, this));
  }
}
Slider.prototype.setCurrent = function (index) {
  if (index instanceof Slide) {
    index = this.slides.indexOf(index);
  }

  if (index === -1 || index === null) {
    return;
  }

  var next = this.next();
  var prev = this.prev();

  if (this.current()) {
    this.current().setType();
    next && next.setType();
    prev && prev.setType();
  }

  this.currentIndex = index % this.slides.length;

  next = this.next();
  prev = this.prev();

  this.current().setType('current');
  next && next.setType('next');
  prev && prev.setType('prev');
}
Slider.prototype.getNextIndex = function () {
  if (this.currentIndex >= this.slides.length - 1) {
    return this.options.loop ? 0 : -1;
  }

  return this.currentIndex + 1;
}
Slider.prototype.getPrevIndex = function () {
  if (this.currentIndex <= 0) {
    return this.options.loop ? (this.slides.length - 1) : -1;
  }

  return this.currentIndex - 1;
}
Slider.prototype.current = function () {
  return this.slides[this.currentIndex];
}
Slider.prototype.next = function () {
  return this.slides[this.getNextIndex()] || null;
}
Slider.prototype.prev = function () {
  return this.slides[this.getPrevIndex()] || null;
}
Slider.prototype.on = function (listeners) {
  Object.assign(this.listeners, listeners);

  return this;
}
Slider.prototype.setup = function (options) {
  Object.assign(this.options, options);
  this.setCurrent(this.currentIndex);

  return this;
}
Slider.prototype.emit = function (key, context, argumentList) {
  if (this.listeners[key] instanceof Function) {
    this.listeners[key].apply(context || this, argumentList);
  }
}
Slider.DEFAULT_LISTENERS = DEFAULT_LISTENERS;

export { Slider };
