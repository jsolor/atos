function debounce(callback, wait) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => { 
      callback.apply(this, args)
    }, wait);
  };
}

export default debounce;
