let timerId: any;
export const debounce = (timer: number, callback: () => void) => {
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    clearTimeout(timerId);
    callback();
  }, timer);
};
