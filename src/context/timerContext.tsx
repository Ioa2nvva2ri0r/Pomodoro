import React, { useState } from 'react';
// Redux
import { useAppSelector } from '../redux/hooks';
// Types
type TKeyAction =
  | 'NOTHING'
  | 'STOP'
  | 'START'
  | 'NEXT'
  | 'PAUSE_WORK'
  | 'PAUSE_SUCCESS'
  | 'BREAK_WORK'
  | 'BREAK_SUCCESS'
  | 'START_NEXT'
  | 'STOP_ALL'
  | 'PAUSE_ALL_START'
  | 'BREAK_ALL_START'
  | 'BREAK_ALL_NEXT'
  | 'PAUSE_ALL'
  | 'BREAK_ALL'
  | 'PAUSE_BREAK_WORK'
  | 'PAUSE_BREAK_SUCCESS'
  | 'PAUSE_BREAK_ALL';
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
    decrease: boolean;
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
    decrease: false,
  },
});

export function TimerContext({ children }: { children: React.ReactNode }) {
  // Redux
  const { breakFrequency } = useAppSelector((state) => state.setting || {});
  const { action, task, setTime } = useAppSelector(
    (state) => state.pomodoro.data[0] || {}
  );
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
    STOP: coincidence('stop'),
    START: coincidence('start'),
    NEXT: coincidence('next'),
    PAUSE_WORK: coincidence('pause-work'),
    PAUSE_SUCCESS: coincidence('pause-success'),
    BREAK_WORK: coincidence('break-work'),
    BREAK_SUCCESS: coincidence('break-success'),
    // Combinations
    START_NEXT: coincidence('start', 'next'),
    STOP_ALL: coincidence('nothing', 'next', 'stop'),
    PAUSE_ALL_START: coincidence('pause-work', 'pause-success', 'start'),
    BREAK_ALL_START: coincidence('break-work', 'break-success', 'start'),
    BREAK_ALL_NEXT: coincidence('break-work', 'break-success', 'next'),
    PAUSE_ALL: coincidence('pause-work', 'pause-success'),
    BREAK_ALL: coincidence('break-work', 'break-success'),
    PAUSE_BREAK_WORK: coincidence('pause-work', 'break-work'),
    PAUSE_BREAK_SUCCESS: coincidence('pause-success', 'break-success'),
    PAUSE_BREAK_ALL: coincidence(
      'pause-work',
      'break-work',
      'pause-success',
      'break-success'
    ),
  };
  const breakShort = task % breakFrequency !== 0;

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
            (activeAction.STOP_ALL && setTime.work >= 3541) ||
            (activeAction.BREAK_WORK && setTime.break.short >= 841) ||
            (activeAction.BREAK_SUCCESS &&
              (breakShort
                ? setTime.break.short >= 841
                : setTime.break.long >= 1741)),
          decrease:
            (activeAction.STOP_ALL && setTime.work <= 1200) ||
            (activeAction.BREAK_WORK && setTime.break.short <= 180) ||
            (activeAction.BREAK_SUCCESS &&
              (breakShort
                ? setTime.break.short <= 180
                : setTime.break.long <= 900)),
        },
      }}
    >
      {children}
    </timerContext.Provider>
  );
}
