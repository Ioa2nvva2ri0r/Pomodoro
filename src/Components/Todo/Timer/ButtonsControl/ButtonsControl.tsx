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
import type { IChangeDataTodo } from '../Timer';
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
  const { setTime, count } = useAppSelector((state) => state.pomodoro.data[0]);

  const handleTimer = (setTime: React.Dispatch<React.SetStateAction<number>>) =>
    timer.setId(Number(setInterval(() => setTime((p) => (p -= 1)), 1000)));

  const setStart = () => {
    funChangeTodo({
      action: action.active.NOTHING__WORK_STOP ? 'start' : 'break',
    });

    if (action.active.NOTHING__WORK_STOP)
      work.value !== 0 && handleTimer(work.setValue);
    else {
      if (breakShort && pauseShort.value !== 0)
        handleTimer(pauseShort.setValue);
      else if (!breakShort && pauseLong.value !== 0)
        handleTimer(pauseLong.setValue);
    }
  };
  const setStop = () => {
    work.setValue(setTime.work);
    pauseShort.setValue(setTime.pause.short);
    pauseLong.setValue(setTime.pause.long);

    funChangeTodo({
      ...initValueTodo,
      count: {
        stop: count.stop + 1,
        pause: 0,
      },
    });
  };
  const setPause = () => {
    funChangeTodo({
      action: action.active.START ? 'work-stop' : 'break-stop',
      ...(action.active.BREAK && {
        setTime: {
          pause: { short: pauseShort.value, long: pauseLong.value },
        },
      }),
      passedTime: {
        ...(action.active.START && {
          spent: setTime.work - work.value,
        }),
        ...(action.active.BREAK && {
          pause: finallyTimePause,
        }),
      },
    });
  };

  const setContinue = () => {
    funChangeTodo({
      action: action.active.WORK_STOP ? 'break' : 'nothing',
      setTime: {
        pause: initData.pause,
      },
      passedTime: {
        ...(action.active.WORK_STOP && {
          spent: setTime.work - work.value,
        }),
        ...(action.active.BREAK_ALL && {
          pause: finallyTimePause,
        }),
      },
      ...(action.active.WORK_STOP && { count: { pause: count.pause + 1 } }),
      ...(action.active.BREAK_ALL && { success: true }),
    });

    if (action.active.WORK_STOP)
      breakShort
        ? handleTimer(pauseShort.setValue)
        : handleTimer(pauseLong.setValue);
  };

  return (
    <div className={styles.btn__box}>
      {Object.entries({
        run: {
          onClick: action.active.INACTION ? setStart : setPause,
          children: action.active.NOTHING
            ? 'Старт'
            : action.active.STOP_ALL
            ? 'Продолжить'
            : 'Пауза',
        },
        reset: {
          onClick: action.active.WORK_STOP__BREAK_ALL ? setContinue : setStop,
          children: action.active.WORK_STOP
            ? 'Сделано'
            : action.active.BREAK_ALL
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
