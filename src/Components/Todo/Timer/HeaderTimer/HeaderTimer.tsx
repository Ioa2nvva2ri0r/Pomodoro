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
  const { name, task, count } = todos[0];
  // React Ref
  const headerRef = useRef<HTMLElement>(null);
  // Raect Effect
  useEffect(() => {
    if (todos[0].success && todos.length === 1)
      headerRef.current?.classList.add(styles.header__hidden);
  }, [todos, headerRef.current]);

  return (
    <header
      ref={headerRef}
      className={styles.header}
      style={{
        backgroundColor: activeColor(
          activeAction.START_NEXT,
          activeAction.PAUSE_BREAK_ALL,
          colorTheme(themeLight ? 77 : 17)
        ),
      }}
    >
      <h3 className={styles.todo} title={name} children={name} />
      <strong className={styles.count}>{`${
        activeAction.PAUSE_BREAK_WORK ? 'Перерыв' : 'Помидор'
      } ${activeAction.PAUSE_BREAK_WORK ? count.break : task}`}</strong>
    </header>
  );
}
