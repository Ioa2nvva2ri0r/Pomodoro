import React, { useState, useEffect, useRef } from 'react';
// Utils
import { convertInString } from '../../../../../Utils/js/сonvert';
// Styles-module
import styles from './number.module.scss';
// Types
interface INumberTimerProps {
  timer: boolean;
  number: string;
}

export function Number({ timer, number }: INumberTimerProps) {
  const [n, setn] = useState(number);
  const [active, setActive] = useState(timer);
  // React Effect
  useEffect(() => {
    if (timer && n !== number) {
      setActive(false);
      setTimeout(() => {
        setn(number);
        setActive(true);
      }, 600);
    }
  }, [number, timer]);

  return (
    <span
      className={convertInString(
        styles.number,
        !active && styles.number__visible
      )}
      children={number}
    />
  );
}
