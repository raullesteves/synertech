export default function hasParent(el, fn) {

    if (!fn) return false;
  
    if (!(fn instanceof Function)) {
      const target = fn;
      fn = parent => parent === target;
    }
  
    while (el = el.parentElement) {
  
      if (fn(el)) return true;
  
    }
  
    return false;
  
  };