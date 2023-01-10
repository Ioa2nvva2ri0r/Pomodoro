export function animateStyles<T>(
  el: HTMLElement | null,
  funState: (value: React.SetStateAction<T | boolean>) => void,
  cssClass: string,
  state: T | boolean = false,
  ms: number = 390
) {
  el?.classList.add(cssClass);
  setTimeout(() => {
    funState(state);
    el?.classList.remove(cssClass);
  }, ms);
}
