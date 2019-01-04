export default class Slider {

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
  