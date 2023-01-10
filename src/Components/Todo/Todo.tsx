import React from 'react';
// React Context
import { TimerContext } from '../../context/timerContext';
// Components
import { CreateTodo } from './SideLeft/CreateTodo';
import { SideDesc } from './SideLeft/SideDesc';
import { ListTodo } from './SideLeft/ListTodo';
import { Timer } from './Timer';
// Styles-module
import styles from './todo.module.scss';

export function Todo() {
  return (
    <section className={styles.section}>
      <TimerContext>
        <div className={styles.side__left}>
          <SideDesc />
          <CreateTodo />
          <ListTodo />
        </div>
        <div className={styles.side__right}>
          <Timer />
        </div>
      </TimerContext>
    </section>
  );
}
