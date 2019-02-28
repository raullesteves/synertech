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
  
  export {
    _map,
    screen,
    _toggle,
    _show,
    _hide
  };
  