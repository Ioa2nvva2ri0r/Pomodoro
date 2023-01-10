import React, { useContext } from 'react';
// React Context
import { timerContext } from '../../../../context/timerContext';
// Redux
import { useAppSelector } from '../../../../redux/hooks';
import { initValueTodo } from '../../../../redux/slices/dataPomodoroSlice';
// Utils
import { convertInString } from '../../../../Utils/js/сonvert';
// Styles-module
import styles from './buttonscontrol.module.scss';
// Types
import { IChangeDataTodo } from '../Timer';
interface IButtonsControlProps {
  funChangeTodo: (props: IChangeDataTodo) => void;
  finallyTimePause: number;
}

export function ButtonsControl({
  funChangeTodo,
  finallyTimePause,
}: IButtonsControlProps) {
  // React Context
  const {
    timer,
    time: { work, pauseShort, pauseLong },
    breakShort,
    action,
  } = useContext(timerContext);
  // Redux
  const { initData } = useAppSelector((state) => state.setting);
  const todo = useAppSelector((state) => state.pomodoro.data[0]);
  const { setTime, count } = todo;

  const handleTimer = (setTime: React.Dispatch<React.SetStateAction<number>>) =>
    timer.setId(Number(setInterval(() => setTime((p) => (p -= 1)), 1000)));

  const setStart = () => {
    funChangeTodo({ action: 'start' });
    work.value !== 0 && handleTimer(work.setValue);
  };
  const setStop = () => {
    work.setValue(setTime.work);
    funChangeTodo({
      ...initValueTodo,
      count: {
        stop: count.stop + 1,
        break: 0,
      },
    });
  };
  const setPause = () => {
    if (action.active.START) pauseShort.setValue(setTime.break.short);

    funChangeTodo({
      action: action.active.PAUSE_WORK
        ? 'break-work'
        : action.active.PAUSE_SUCCESS
        ? 'break-success'
        : action.active.NEXT
        ? 'break-success'
        : action.active.BREAK_SUCCESS
        ? 'pause-success'
        : 'pause-work',
      ...(action.active.PAUSE_ALL && {
        setTime: {
          break: { short: pauseShort.value, long: pauseLong.value },
        },
      }),
      ...(action.active.PAUSE_ALL_START && {
        passedTime: {
          ...(action.active.START && {
            spent: setTime.work - work.value,
          }),
          ...(action.active.PAUSE_ALL && {
            break: finallyTimePause,
          }),
        },
      }),
      ...(action.active.START && {
        count: {
          break: count.break + 1,
        },
      }),
    });

    if (action.active.BREAK_ALL_START)
      if (
        (breakShort ||
          (!breakShort && (action.active.START || action.active.BREAK_WORK))) &&
        pauseShort.value !== 0
      )
        handleTimer(pauseShort.setValue);
      else if (
        !breakShort &&
        action.active.BREAK_SUCCESS &&
        pauseLong.value !== 0
      )
        handleTimer(pauseLong.setValue);
  };
  const setContinue = () => {
    funChangeTodo({
      action: action.active.PAUSE_BREAK_WORK ? 'next' : 'nothing',
      setTime: {
        break: initData.break,
      },
      ...(action.active.PAUSE_BREAK_ALL && {
        passedTime: {
          break: finallyTimePause,
        },
      }),
      ...(action.active.PAUSE_BREAK_SUCCESS && { success: true }),
    });
  };

  return (
    <div className={styles.btn__box}>
      {Object.entries({
        run: {
          onClick: action.funActive('nothing', 'next', 'stop')
            ? setStart
            : setPause,
          children: action.active.NOTHING
            ? 'Старт'
            : action.active.BREAK_ALL_NEXT
            ? 'Продолжить'
            : 'Пауза',
        },
        reset: {
          onClick: action.active.NEXT
            ? setPause
            : action.active.PAUSE_BREAK_ALL
            ? setContinue
            : setStop,
          children: action.active.NEXT
            ? 'Сделано'
            : action.active.PAUSE_BREAK_ALL
            ? 'Пропустить'
            : 'Стоп',
          disabled: action.active.NOTHING,
        },
      }).map(([key, value]) => (
        <button
          key={`btn-${key}`}
          className={convertInString(
            styles[`btn__${key}`],
            'us-btn',
            `us-btn__${key}`
          )}
          {...value}
        />
      ))}
    </div>
  );
}
