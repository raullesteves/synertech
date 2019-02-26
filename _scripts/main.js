import Slider from './Slider';
import Carousel from './Carousel';
import masks from './masks';
import {
  _map,
  screen
} from './helpers';

const sliderOptions = {
  autoplay: slider => {
    slider
      .play()
      .on('mouseover', () => slider.pause())
      .on('mouseout', () => slider.play());
  }
};

function setup() {

  document.body.addEventListener("touchstart", function () {
      return false
  });

  const offsetHeader = document.querySelector('.site-header').offsetHeight;
  const pageLinks = document.querySelectorAll('a[href^="' + baseurl + '/#"].scroll');
  Array.prototype.forEach.call(pageLinks, link => link.addEventListener("click", function(){
      const section = document.querySelector(this.hash);
      if (!section) return false;
      scrollToY(section.offsetTop - offsetHeader, 1000);
  }));  

  window.sliders = _map('.slider', parent => {
    const slider = new Slider({
      parent
    });
    configSlider(slider, parent);
  });

  window.carousels = _map('.carousel', parent => {
    const size = parent.getAttribute('data-size') | 0;
    const carousel = new Carousel({
      parent,
      size
    });
    configSlider(carousel, parent);
    return carousel;
  });

  _map('[data-mask]', campo => {
    const name = campo.getAttribute('data-mask');
    if (!name) return;
    if (!masks[name] || !(masks[name] instanceof Function)) return;
    campo.addEventListener('input', function () {
      masks[name](campo);
    });
  });

  _map('[data-script]', item => {
    const valueFn = item.getAttribute("data-script");
    if (!valueFn) return;
    if (!item.value) return;
    window[valueFn](0, item.value);
  });
}

window.setup = setup;

function configSlider(slider, parent) {
  const first = parent.getAttribute('data-first') | 0;
  if (first) {
    slider.goTo(first);
  }

  const options = parent.hasAttribute('data-options') ? parent.getAttribute('data-options').split(' ') : [];
  options.forEach(option => sliderOptions[option] && sliderOptions[option](slider));

  const sliderCallbacks = {
    openOnMobile: () => {
      if (screen().width > 600) return;
      const first = slider.find(slide => slide.getAttribute('data-order') === '0');
      if (!first) return;
      const btn = first.querySelector('.info-img a[href^="javascript:"]');
      if (!btn) return;
      btn.click();
    }
  };

  _map('[data-control]', control => {
    const target = control.getAttribute('data-control');
    const targetElement = target ? document.querySelector(target) : null;

    if (targetElement && targetElement === slider.parent) {
      const action = control.getAttribute('data-action');
      if ((action === 'prev' || action === 'next') && (slider.size >= slider.length)) {
        control.setAttribute('data-oversize', true);
      }
      const actionData = control.getAttribute('data-params');
      const params = actionData ? actionData.split(',') : null;
      const callback = control.getAttribute('data-callback');
      if (action && slider[action] instanceof Function) {
        control.addEventListener('click', function () {
          slider[action].apply(slider, params);
          if (callback && sliderCallbacks[callback]) sliderCallbacks[callback]();
        });
      }
    }

  });
}

window.modal = function modal(modal) {
  if (typeof modal === 'string') modal = document.querySelector(modal);
  return {
    abrir: function() {modal.classList.add('target');},
    fechar: function() {modal.classList.remove('target');}
  };
};

