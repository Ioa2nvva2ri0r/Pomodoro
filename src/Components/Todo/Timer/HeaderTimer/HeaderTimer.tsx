import React, { useEffect, useRef, useContext } from 'react';
// react Context
import { timerContext } from '../../../../context/timerContext';
// Redux
import { useAppSelector } from '../../../../redux/hooks';
// Utils
import { activeColor, colorTheme } from '../../../../Utils/react/activeColor';
// Styles-module
import styles from './headertimer.module.scss';

export function HeaderTimer() {
  // React Context
  const { action } = useContext(timerContext);
  const activeAction = action.active;
  // Redux
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');
  const todos = useAppSelector((state) => state.pomodoro.data);
  const completedTodos = useAppSelector(
    (state) => state.pomodoro.dataCompleted
  );
  const { name, task } = todos[0];
  // React Ref
  const headerRef = useRef<HTMLElement>(null);
  // Raect Effect
  useEffect(() => {
    if (todos[0].success && todos[0].pomodoro === 1 && todos.length === 1)
      headerRef.current?.classList.add(styles.header__hidden);
  }, [todos, headerRef.current]);

  const finallyValue = (arr: number[]) =>
    arr.reduce((prev, curr) => prev + curr, 0);

  return (
    <header
      ref={headerRef}
      className={styles.header}
      style={{
        backgroundColor: activeColor(
          activeAction.START__WORK_STOP,
          activeAction.BREAK_ALL,
          colorTheme(themeLight ? 77 : 17)
        ),
      }}
    >
      <h3 className={styles.todo} title={name} children={name} />
      <strong className={styles.count}>{`${
        activeAction.BREAK_ALL ? 'Перерыв' : 'Помидор'
      } ${
        activeAction.BREAK_ALL
          ? finallyValue(completedTodos.map((o) => o.count.pause)) +
            (todos[0].success ? 0 : 1)
          : completedTodos.filter((o) => o.task === task).length + 1
      }`}</strong>
    </header>
  );
}
