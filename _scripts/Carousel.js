import Slider from './Slider';

export default class Carousel extends Slider {

  constructor(config) {
    config.parentSelector = config.parentSelector || '.carousel';
    super(config);
    this.type = 'Carousel';
    this.size = config.size | 0;
    this.compose();
  }

  compose() {
    const position = this.index + 1;
    this.forEach((slide, i) => {
      let itemOrder = i - position + 1;
      if (itemOrder < 0) itemOrder = this.length - position + i + 1;
      slide.setAttribute('data-order', itemOrder);

      slide.classList.remove('prev');
      slide.classList.remove('current');
      slide.classList.remove('next');
      slide.classList.remove('will-go-prev');
      slide.classList.remove('will-go-next');

      if (this.size) {
        const className =
          this.length <= this.size ? 'current' :
          itemOrder > -1 && itemOrder < this.size ? 'current' :
          itemOrder === -1 || itemOrder === this.length - 1 ? 'prev' :
          itemOrder === this.size ? 'next' :
          '';
        if (!className) return this;
        slide.classList.add(className);
        slide.style.order = itemOrder;
      }

      if (this.dir) {
        const animClassName = 'will-go-' + this.dir;
        slide.classList.add(animClassName);
        slide.addEventListener("webkitAnimationEnd", function() {
          removeWillRenderClass(slide, animClassName);
        });
        slide.addEventListener("animationend", function() {
          removeWillRenderClass(slide, animClassName);
        });

      }
    });

    function removeWillRenderClass(slide, className) {
      slide.classList.remove(className);
    }

    return this;
  }

  prev() {
    this.dir = 'prev';
    return super.prev();
  }

  next() {
    this.dir = 'next';
    return super.next();
  }

  goTo(index) {
    this.dir = index > this.index ? 'next' : 'prev';
    return super.goTo(index);
  }

}
