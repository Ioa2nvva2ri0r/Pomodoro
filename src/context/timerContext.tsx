import React, { useState } from 'react';
// Redux
import { useAppSelector } from '../redux/hooks';
// Types
type TKeyAction =
  | 'NOTHING'
  | 'START'
  | 'BREAK'
  | 'WORK_STOP'
  | 'BREAK_STOP'
  | 'START__BREAK'
  | 'START__WORK_STOP'
  | 'STOP_ALL'
  | 'BREAK_ALL'
  | 'NOTHING__WORK_STOP'
  | 'WORK_STOP__BREAK_ALL'
  | 'INACTION';
interface IValueTime {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}
interface ITimerDataContext {
  timer: {
    id: number;
    setId: React.Dispatch<React.SetStateAction<number>>;
  };
  time: {
    work: IValueTime;
    pauseShort: IValueTime;
    pauseLong: IValueTime;
  };
  breakShort: boolean;
  action: {
    value: TActionTimer;
    active: { [k in TKeyAction]?: boolean };
    funActive: (...value: TActionTimer[]) => boolean;
  };
  disabled: {
    increase: boolean;
    // decrease: boolean;
  };
}

const NOOP = () => {};

export const timerContext = React.createContext<ITimerDataContext>({
  timer: { id: 0, setId: NOOP },
  time: {
    work: { value: 1, setValue: NOOP },
    pauseShort: { value: 1, setValue: NOOP },
    pauseLong: { value: 1, setValue: NOOP },
  },
  breakShort: false,
  action: { value: 'nothing', active: {}, funActive: () => false },
  disabled: {
    increase: false,
    // decrease: false,
  },
});

export function TimerContext({ children }: { children: React.ReactNode }) {
  // Redux
  const { pauseFrequency } = useAppSelector((state) => state.setting || {});
  const { action, setTime } = useAppSelector(
    (state) => state.pomodoro.data[0] || {}
  );
  const {
    count: { pomodoro },
  } = useAppSelector((state) => state.pomodoro.dataOverallCompleted);
  // React State
  const [timerId, setTimerId] = useState(0);
  const [workTime, setWorkTime] = useState(1);
  const [pauseShortTime, setPauseShortTime] = useState(1);
  const [pauseLongTime, setPauseLongTime] = useState(1);
  // Check Action
  const coincidence = (...actions: TActionTimer[]): boolean =>
    actions.map((a) => action === a).includes(true);

  const activeAction = {
    NOTHING: coincidence('nothing'),
    START: coincidence('start'),
    BREAK: coincidence('break'),
    WORK_STOP: coincidence('work-stop'),
    BREAK_STOP: coincidence('break-stop'),
    // Combinations
    START__BREAK: coincidence('start', 'break'),
    START__WORK_STOP: coincidence('start', 'work-stop'),
    STOP_ALL: coincidence('work-stop', 'break-stop'),
    BREAK_ALL: coincidence('break', 'break-stop'),
    NOTHING__WORK_STOP: coincidence('nothing', 'work-stop'),
    WORK_STOP__BREAK_ALL: coincidence('work-stop', 'break', 'break-stop'),
    INACTION: coincidence('nothing', 'work-stop', 'break-stop'),
  };
  const breakShort = (pomodoro + 1) % pauseFrequency !== 0;

  return (
    <timerContext.Provider
      value={{
        timer: { id: timerId, setId: setTimerId },
        time: {
          work: { value: workTime, setValue: setWorkTime },
          pauseShort: { value: pauseShortTime, setValue: setPauseShortTime },
          pauseLong: { value: pauseLongTime, setValue: setPauseLongTime },
        },
        breakShort,
        action: { value: action, active: activeAction, funActive: coincidence },
        disabled: {
          increase:
            (activeAction.NOTHING__WORK_STOP && setTime.work >= 3541) ||
            (activeAction.BREAK_STOP &&
              (breakShort
                ? setTime.pause.short >= 841
                : setTime.pause.long >= 1741)),
          // decrease:
          //   (activeAction.STOP_ALL && setTime.work <= 1200) ||
          //   (activeAction.PAUSE_WORK && setTime.pause.short <= 180) ||
          //   (activeAction.PAUSE_SUCCESS &&
          //     (breakShort
          //       ? setTime.pause.short <= 180
          //       : setTime.pause.long <= 900)),
        },
      }}
    >
      {children}
    </timerContext.Provider>
  );
}
