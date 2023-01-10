import React from 'react';
// Redux
import { useAppSelector } from '../../../../redux/hooks';
// Styles-module
import styles from './desctimer.module.scss';

export function DescTimer() {
  // Redux
  const { task, name } = useAppSelector((state) => state.pomodoro.data[0]);

  return (
    <p className={styles.desc}>
      <span className={styles.desc__count}>Задача {task} - </span>
      <span className={styles.desc__todo} title={name} children={name} />
    </p>
  );
}
