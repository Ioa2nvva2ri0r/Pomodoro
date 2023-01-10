import React from 'react';
// Utils
import { debounce } from '../js/debounce';

export const invalidMessage = debounce(
  (
    el: HTMLElement,
    funMessage: (value: React.SetStateAction<string>) => void,
    message: string
  ) => {
    funMessage(message);
    if (el) {
      setTimeout(() => {
        window.scrollBy({
          top: el.getBoundingClientRect().top - 50,
          behavior: 'smooth',
        });

        el.classList.add('error-active');
      }, 10);
      setTimeout(() => el.classList.remove('error-active'), 5000 - 305);
      setTimeout(() => funMessage(''), 5000);
    }
  },
  5000
);
