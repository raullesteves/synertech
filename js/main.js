(function () {
'use strict';

class Slider {

    constructor(config) {
      this.type = 'Slider';
      if (!(this instanceof Slider)) return new Slider(config);
  
      this.parent = config.parent || document.querySelector(config.parentSelector || '.slider');
      if (!this.parent) throw '[SLIDER]: Container não encontrado.';
  
      this.childSelector = config.childSelector || '.slide';
      if (!this.children.length) throw '[SLIDER]: Slides não encontrados.';
  
      this.index = 0;
      this.duration = config.duration || 3000;
      this.parent.classList.add('set');
      this.compose();
    }
  
    get children() {
      return Array.prototype.slice.call(this.parent.querySelectorAll(this.childSelector));
    }
  
    get length() {
      return this.children.length;
    }
  
    forEach(fn) {
      return this.children.forEach(fn);
    }
  
    map(fn) {
      return this.children.map(fn);
    }
  
    filter(fn) {
      return this.children.filter(fn);
    }
  
    find(fn) {
      return this.children.find(fn);
    }
  
    compose() {
      var nextIndex, prevIndex;
      prevIndex = this.index > 0 ? this.index - 1 : this.children.length - 1;
      nextIndex = this.index < this.children.length - 1 ? this.index + 1 : 0;
      this.forEach((el, i) => {
        el.classList.remove('prev');
        el.classList.remove('current');
        el.classList.remove('next');
        if (i === prevIndex) el.classList.add('prev');
        if (i === nextIndex) el.classList.add('next');
        if (i === this.index) el.classList.add('current');
      });
      return this;
    }
  
    play() {
      var that;
      that = this;
      this.playingStateID = setInterval(function () {
        return that.next();
      }, this.duration);
      this.isPlaying = true;
      return this;
    }
  
    pause() {
      clearInterval(this.playingStateID);
      this.isPlaying = false;
      return this;
    }
  
    playpause() {
      if (this.isPlaying) {
        return this.pause();
      } else {
        return this.play();
      }
    }
  
    prev() {
      var playingState;
      if (this.index > 0) {
        this.index--;
      } else {
        this.index = this.children.length - 1;
      }
      playingState = this.isPlaying;
      if (playingState) {
        this.pause();
      }
      this.compose();
      if (playingState) {
        return this.play();
      }
    }
  
    next() {
      var playingState;
      if (this.index < this.children.length - 1) {
        this.index++;
      } else {
        this.index = 0;
      }
      playingState = this.isPlaying;
      if (playingState) {
        this.pause();
      }
      this.compose();
      if (playingState) {
        return this.play();
      }
    }
  
    goTo(index) {
      this.index = index;
      return this.compose();
    }
  
    on(event, fn) {
      this.parent.addEventListener(event, fn);
      return this;
    }
  
    off(event, fn) {
      this.parent.removeEventListener(event, fn);
      return this;
    }
  
    inspect(collapsed) {
      console[collapsed === true ? 'groupCollapsed' : 'group'](this.type);
      console.table(
        Object.keys(this).map(key => {
          return {
            prop: key,
            value: this[key],
            type: typeof this[key]
          }
        })
      );
      console.log(this.parent);
      console.log(this.children);
      console.warn(Date.now().toString());
      console.groupEnd(this.type);
  
      return this;
    }
  
}

class Carousel extends Slider {

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

const masks = {

    telefone: campo => {
      const regras = [/\d+/gi, /^(\d\d?)/, /^(\d\d)(\d{4})-?(\d{1,4})/, /^(\d\d)(\d{5})-?(\d{1,4})/];
      const valores = campo.value.match(regras[0]);
      if (!valores) return campo.value = '';
      const valor = campo.value = valores.join('');
      if (valor.length > 0) campo.value = valor.replace(regras[1], '($1');
      if (valor.length > 2) campo.value = valor.replace(regras[1], '($1) ');
      if (valor.length > 6) campo.value = valor.replace(regras[2], '($1) $2-$3');
      if (valor.length > 10) campo.value = valor.replace(regras[3], '($1) $2-$3');
      if (valor.length > 11) campo.value = campo.value.substr(0, 15);
    },
  
    cpf: campo => {
      const numeros = /\d+/gi;
      const valores = campo.value.match(numeros);
      if (!valores) return campo.value = '';
      const valor = valores.join('');
      const cpf = /^([0-9]{1,3})?\.?([0-9]{1,3})?\.?([0-9]{1,3})?-?([0-9]{1,2})?$/;
      const cnpj = /^([0-9]{1,2})?\.?([0-9]{1,3})?\.?([0-9]{1,3})?\/?([0-9]{1,4})?-?([0-9]{1,2})?$/;
      campo.value = campo.value.replace(/[^\d./-]/gi, '');
      if (cpf.test(valor)) campo.value = valor.replace(cpf, (all, a, b, c, d) => {
        return (a || '') + (b ? '.' + b : '') + (c ? '.' + c : '') + (d ? '-' + d : '');
      });
      else if (cnpj.test(valor)) campo.value = valor.replace(cnpj, (all, a, b, c, d, e) => {
        return (a || '') + (b ? '.' + b : '') + (c ? '.' + c : '') + (d ? '/' + d : '') + (e ? '-' + e : '');
      });
      if (campo.value.length > 18) campo.value = campo.value.substr(0, 18);
    },
  
    data: campo => {
      if (campo.type === 'date') return;
      const numeros = campo.value.replace(/^0?\/|[^\d/]/gi, '');
      if (numeros === '') {
        campo.value = numeros;
        campo.style.borderColor = null;
        return;
      }
      campo.value = numeros
        .replace(/(^|\/)00+\/?/g, '0')
        .replace(/(^|\/)([1-9]\/)/, '0$2')
        .replace(
          /(\d\d)(\/?)(\d{1,2})?(\/?)0*(\d{1,4})?.*/g,
          function (all, dd, s1, mm, s2, aaaa) {
            if (dd > 31 || mm > 12) campo.style.borderColor = 'red';
            else campo.style.borderColor = null;
            return dd + (mm ? '/' + mm : s1 || '') + (aaaa ? '/' + aaaa : s2 || '');
          }
        );
    },
  
    numeros: campo => {
      if (!/^[0-9]+$/.test(campo.value)) {
        campo.value = campo.value.substring(0, campo.value.length - 1);
      }
    }
  
  };

function hasParent(el, fn) {

    if (!fn) return false;
  
    if (!(fn instanceof Function)) {
      const target = fn;
      fn = parent => parent === target;
    }
  
    while (el = el.parentElement) {
  
      if (fn(el)) return true;
  
    }
  
    return false;
  
  }

function _map(what, callback) {
    if (typeof what === 'string') what = document.querySelectorAll(what);
    if (!(what instanceof Array)) what = Array.prototype.slice.call(what);
    if (callback instanceof Function) what = what.map(w => callback(w));
    return what;
  }
  
  function screen() {
    const w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      width = w.innerWidth || e.clientWidth || g.clientWidth,
      height = w.innerHeight || e.clientHeight || g.clientHeight;
    return {
      width,
      height
    }
  }

  function _toggle(show, hide) {
    if (show) _show(show);
    if (hide) _hide(hide);
  }
  
  function _show(what, callback) {
    if (typeof what === 'string') what = document.querySelectorAll(what);
    if (what instanceof Array) return what.forEach(w => _show(w, callback));
    if (what instanceof NodeList) return Array.prototype.forEach.call(what, w => _show(w, callback));
    if (!(what instanceof Node)) return;
    what.removeAttribute('hidden');
    if (callback instanceof Function) callback(what);
  }
  
  function _hide(what, callback) {
    if (typeof what === 'string') what = document.querySelectorAll(what);
    if (what instanceof Array) return what.forEach(w => _hide(w, callback));
    if (what instanceof NodeList) return Array.prototype.forEach.call(what, w => _hide(w, callback));
    if (!(what instanceof Node)) return;
    what.setAttribute('hidden', true);
    if (callback instanceof Function) callback(what);
  }

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
      scrollToY(section.offsetTop, 1000);      
      menuIcons.forEach(btn => {
        btn.classList.remove('hover');
      });      
  }));

  const menuBars = document.querySelector('.site-nav');
  const header = document.querySelector('.site-header');
  console.log(header);
  
  const winH = window.innerHeight;
  const logoBig = document.querySelector('[data-logo-big]');
  const logo = document.querySelector('[data-logo]');
  window.onscroll = ()=>{
    if(document.body.scrollTop >= winH || document.documentElement.scrollTop >= winH){
      menuBars.removeAttribute('hidden');
      header.classList.add('position-unset');
    }
    else{
      menuBars.setAttribute('hidden', true);
      header.classList.remove('position-unset');
    }
    if(document.body.scrollTop > 100 || document.documentElement.scrollTop > 100){
      _toggle(logo, logoBig);
      _hide('.social-media');
    }
    else{
      _toggle(logoBig, logo);
      _show('.social-media');

    }
  };

  const sectionTop = document.querySelector('.section-home');
  scrollToY(sectionTop.offsetTop, 1000);      

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

  const menuIcons = Array.prototype.slice.call(document.querySelectorAll('.menu-icon'));

  menuIcons.forEach(btn => btn.addEventListener('click', function (e) {
    e.preventDefault();
    this.classList.toggle('hover');
  }));
  
  document.body.addEventListener('click', function (e) {
    menuIcons.forEach(btn => {
      const isTarget = el => e.target === el || hasParent(e.target, el);
      const menuContainer = btn.parentElement.querySelector('.trigger');
      if (isTarget(btn) || isTarget(menuContainer)) return;
      btn.classList.remove('hover');
    });
  }, false);  

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

}());

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOltdLCJzb3VyY2VzQ29udGVudCI6W10sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
