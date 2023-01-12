import React, { useContext } from 'react';
// React Context
import { timerContext } from '../../../../context/timerContext';
// Redux
import { useAppSelector } from '../../../../redux/hooks';
// Utils
import { activeColor, colorTheme } from '../../../../Utils/react/activeColor';
// Components
import { Number } from './Number';
// Styles-module
import styles from './timetimer.module.scss';

export function TimeTimer() {
  // React Context
  const {
    timer,
    time: { work, pauseShort, pauseLong },
    breakShort,
    action,
  } = useContext(timerContext);
  const activeAction = action.active;
  const stopTimer = timer.id !== 0;
  const time = activeAction.BREAK_ALL
    ? breakShort
      ? pauseShort.value
      : pauseLong.value
    : work.value;
  // Redux
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');

  const finaly = (number: number) => ('0' + number).slice(-2).split('');
  const minut = finaly(Math.floor(time / 60));
  const second = finaly(time % 60);

  return (
    <time
      className={styles.main}
      style={{
        color: activeColor(
          activeAction.START,
          activeAction.BREAK_ALL,
          colorTheme(themeLight ? 20 : 80)
        ),
      }}
      children={
        <>
          {minut.map((value, i) => (
            <Number key={`minut-${i + 1}`} timer={stopTimer} number={value} />
          ))}
          <span className={styles.main__colon}>:</span>
          {second.map((value, i) => (
            <Number key={`second-${i + 1}`} timer={stopTimer} number={value} />
          ))}
        </>
      }
    />
  );
}
