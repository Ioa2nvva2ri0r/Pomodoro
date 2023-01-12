import React, { useEffect, useRef, useContext } from 'react';
// React Context
import { timerContext } from '../../../context/timerContext';
// Redux
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setTodo } from '../../../redux/slices/dataPomodoroSlice';
// Utils
import { colorTheme } from '../../../Utils/react/activeColor';
// Components
import { HeaderTimer } from './HeaderTimer';
import { DescTimer } from './DescTimer';
import { TimeTimer } from './TimeTimer';
import { BtnAddTime } from './BtnAddTime';
import { ButtonsControl } from './ButtonsControl';
import IconLogo from '../../Common/Icon/IconLogo';
// Styles-module
import styles from './timer.module.scss';
// Image
import completed from '../../../assets/image/completed.svg';
import tomato from '../../../assets/image/tomato.svg';
// Audio
import alarm from '../../../assets/audio/alarm.mp3';
// Types
export interface IChangeDataTodo {
  action: TActionTimer;
  setTime?: { work?: number; pause?: { short: number; long: number } };
  passedTime?: { spent?: number; pause?: number };
  count?: { stop?: number; pause?: number };
  success?: boolean;
}
interface INotifyContent {
  title: string;
  options: {
    body: string;
    icon: string;
  };
}

export function Timer() {
  // React Context
  const {
    timer,
    time: { work, pauseShort, pauseLong },
    breakShort,
    action,
  } = useContext(timerContext);
  const activeAction = action.active;
  // Redux
  const dispatch = useAppDispatch();
  const { theme, notice } = useAppSelector((state) => state.setting);
  const todos = useAppSelector((state) => state.pomodoro.data);
  const todo = todos[0];
  const { id, name, setTime, passedTime, count } = todo || {};
  // Notification
  const signal = new Audio(alarm);
  const notification = (content: INotifyContent) => {
    if (notice) {
      if (Notification.permission === 'granted')
        new Notification(content.title, content.options);
      signal.play();
      setTimeout(() => signal.pause(), 3000);
    }
  };
  const finallyTimePause =
    passedTime &&
    passedTime.pause +
      (breakShort
        ? setTime.pause.short - pauseShort.value
        : setTime.pause.long - pauseLong.value);
  // React Ref
  const boxMainRef = useRef<HTMLDivElement>(null);
  // React Effect
  useEffect(() => {
    if (todo && todo.success && todos[0].pomodoro === 1 && todos.length === 1)
      boxMainRef.current?.classList.add(styles['container__main-hidden']);
  }, [todos, boxMainRef.current]);
  useEffect(() => {
    if (setTime) {
      work.setValue(setTime.work - passedTime.spent);
      pauseShort.setValue(setTime.pause.short);
      pauseLong.setValue(setTime.pause.long);
    }
  }, [setTime]);
  useEffect(() => {
    if (activeAction.START && work.value <= 0) {
      changeTodo({
        action: 'break',
        passedTime: { spent: passedTime.spent + (setTime.work - work.value) },
        count: { pause: count.pause + 1 },
      });
      notification({
        title: `Задание "${name}" выполнено!`,
        options: {
          body: 'Ура! Теперь можно немного отдохнуть!',
          icon: completed,
        },
      });
    }
  }, [work.value]);
  useEffect(() => {
    if (activeAction.BREAK && (pauseShort.value <= 0 || pauseLong.value <= 0)) {
      changeTodo({
        action: 'nothing',
        passedTime: {
          pause: finallyTimePause,
        },
        success: true,
      });
      notification({
        title: 'Перерыв окончен!',
        options: {
          body: 'Помидорка ждёт вас!',
          icon: tomato,
        },
      });
    }
  }, [pauseShort.value, pauseLong.value]);
  useEffect(() => {
    // Notification support check
    if (!('Notification' in window))
      alert('This browser does not support desktop notification');
    // Notification Permission
    else if (Notification.permission !== 'denied')
      Notification.requestPermission();

    // Setting the initial action
    if (activeAction.START) changeTodo({ action: 'work-stop' });
    else if (activeAction.BREAK)
      changeTodo({
        action: 'break-stop',
        setTime: { pause: setTime.pause },
      });
  }, []);
  // Auxiliary utilities
  const changeTodo = (props: IChangeDataTodo) => {
    const { action, success } = props;
    clearInterval(timer.id);
    timer.setId(0);
    dispatch(
      setTodo({
        method: 'PATCH',
        data: {
          id,
          action,
          setTime: Object.assign({}, todo.setTime, props.setTime),
          passedTime: Object.assign({}, todo.passedTime, props.passedTime),
          count: Object.assign({}, todo.count, props.count),
          success,
        },
      })
    );
  };

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: colorTheme(theme === 'light' ? 96 : 30) }}
    >
      {todo ? (
        <>
          <HeaderTimer />
          <div ref={boxMainRef} className={styles.container__main}>
            <div className={styles.box__main}>
              <TimeTimer />
              <BtnAddTime />
            </div>
            <DescTimer />
            <ButtonsControl
              funChangeTodo={changeTodo}
              finallyTimePause={finallyTimePause}
            />
          </div>
        </>
      ) : (
        <p className={styles.message}>
          У вас нет задач на сегодня, добавьте новую задачу для дальнейшей
          работы <IconLogo />
        </p>
      )}
    </div>
  );
}
