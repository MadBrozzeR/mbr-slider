import { Toucher } from './toucher.js';

function Slide (element, slider) {
  this.slider = slider;
  this.element = element;
}
Slide.prototype.shift = function (value) {
  var relativeShift = this.slider.getRelativeShift(value);
  this.element.style.setProperty('--shift', relativeShift);
}
Slide.prototype.activate = function (state) {
  this.element.setAttribute('data-slide-active', state ? '1' : '0');
}
Slide.prototype.setType = function (type) {
  if (type) {
    this.element.setAttribute('data-slide-type', type);
  } else {
    this.element.removeAttribute('data-slide-type');
  }
}
Slide.prototype.setCurrent = function (value) {
  this.element.setAttribute('data-slide-current', value ? '1' : '0');
}

function Slider (container) {
  this.container = container;

  this.slides = this.getSlides();
  this.setCurrent(0);

  var slider = this;

  Toucher.attach(this.container, {
    start: function () {
      var next = slider.next();
      var prev = slider.prev();

      slider.current().activate(true);
      next && next.activate(true);
      prev && prev.activate(true);
    },
    move: function (touches, event) {
      event.preventDefault();
      slider.shift(touches[0].dx);
    },
    end: function (touches) {
      var next = slider.next();
      var prev = slider.prev();

      var relativeShift = slider.getRelativeShift(touches[0].dx);
      slider.current().activate(false);
      next && next.activate(false);
      prev && prev.activate(false);
      if (relativeShift > 0.4) {
        slider.setCurrent(slider.getPrevIndex());
      } else if (relativeShift < -0.4) {
        slider.setCurrent(slider.getNextIndex());
      }
      slider.shift(0);
    }
  });
}
Slider.prototype.getRelativeShift = function (value) {
  return value / this.container.clientWidth;
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
Slider.prototype.setCurrent = function (index) {
  if (index === -1) {
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
    return this.loop ? 0 : -1;
  }

  return this.currentIndex + 1;
}
Slider.prototype.getPrevIndex = function () {
  if (this.currentIndex <= 0) {
    return this.loop ? (this.slides.length - 1) : -1;
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
Slider.prototype.shift = function (value) {
  var relativeShift = this.getRelativeShift(value);
  this.container.style.setProperty('--shift', relativeShift);
}

export { Slider };
