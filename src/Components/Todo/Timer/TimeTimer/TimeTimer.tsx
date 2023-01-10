import React, { useContext } from 'react';
// React Context
import { timerContext } from '../../../../context/timerContext';
import { useAppSelector } from '../../../../redux/hooks';
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
  const time = activeAction.PAUSE_BREAK_ALL
    ? breakShort || (!breakShort && activeAction.PAUSE_BREAK_WORK)
      ? pauseShort.value
      : pauseLong.value
    : work.value;
  // Redux
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');

  const finaly = (number: number) => ('0' + number).slice(-2).split('');
  const [FMinut, LMinut] = finaly(Math.floor(time / 60));
  const [FSecond, LSecond] = finaly(time % 60);

  return (
    <time
      className={styles.main}
      style={{
        color: activeColor(
          activeAction.START,
          activeAction.PAUSE_ALL,
          colorTheme(themeLight ? 20 : 80)
        ),
      }}
      children={
        <>
          {<Number timer={timer.id !== 0} number={FMinut} />}
          {<Number timer={timer.id !== 0} number={LMinut} />}
          <span className={styles.main__colon}>:</span>
          {<Number timer={timer.id !== 0} number={FSecond} />}
          {<Number timer={timer.id !== 0} number={LSecond} />}
        </>
      }
    />
  );
}
