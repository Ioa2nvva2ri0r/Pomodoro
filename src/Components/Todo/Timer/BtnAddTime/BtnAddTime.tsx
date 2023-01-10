import React, { useContext } from 'react';
// React Context
import { timerContext } from '../../../../context/timerContext';
// Redux
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { setTodo } from '../../../../redux/slices/dataPomodoroSlice';
// Utils
import { colorTheme } from '../../../../Utils/react/activeColor';
// Components
import Icon from '../../../Common/Icon/Icon';
// Styles-module
import styles from './btnaddtime.module.scss';

export function BtnAddTime() {
  // React Context
  const { breakShort, action, disabled } = useContext(timerContext);
  const activeAction = action.active;
  // Redux
  const dispatch = useAppDispatch();
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');
  const { id, setTime } = useAppSelector((state) => state.pomodoro.data[0]);

  const handleAddTime = () => {
    dispatch(
      setTodo({
        method: 'PATCH',
        data: {
          id,
          setTime: {
            ...setTime,
            ...(activeAction.STOP_ALL && {
              work: setTime.work + 60,
            }),
            ...(activeAction.BREAK_ALL && {
              break: {
                ...(breakShort || (!breakShort && activeAction.BREAK_WORK)
                  ? {
                      short: setTime.break.short + 60,
                      long: setTime.break.long,
                    }
                  : {
                      short: setTime.break.short,
                      long: setTime.break.long + 60,
                    }),
              },
            }),
          },
        },
      })
    );
  };

  return (
    <div className={styles.main__box}>
      <button
        className={styles.main}
        style={{ fill: colorTheme(themeLight ? 77 : 17) }}
        disabled={activeAction.PAUSE_ALL_START || disabled.increase}
        onClick={handleAddTime}
        aria-label="Довавить минуту"
        children={
          <Icon
            active="add"
            size={50}
            fill={colorTheme(themeLight ? 77 : 17)}
          />
        }
      />
      {(activeAction.PAUSE_ALL_START || disabled.increase) && (
        <p
          className={styles.main__desc}
          style={{ backgroundColor: colorTheme(themeLight ? 90 : 17) }}
          role="alert"
        >
          {activeAction.PAUSE_ALL_START
            ? 'Добавить минуту к таймеру можно только при его остановке!'
            : disabled.increase && 'Достигнуто максимальное значение таймера!'}
        </p>
      )}
    </div>
  );
}
