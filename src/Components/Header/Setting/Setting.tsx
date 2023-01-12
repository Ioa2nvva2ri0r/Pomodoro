import React, { useState } from 'react';
// Redux
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setTodo } from '../../../redux/slices/dataPomodoroSlice';
import {
  defaultSetting,
  ISettingСonfig,
  setSetting,
} from '../../../redux/slices/settingPomodoroSlice';
// Utils
import { preventDefault } from '../../../Utils/react/preventDefault';
import { convertInString } from '../../../Utils/js/сonvert';
import { colorTheme } from '../../../Utils/react/activeColor';
// Components
import Icon from '../../Common/Icon/Icon';
// Static-data
import { LISTSETTING } from '../../Common/static';
// Styles-module
import styles from './setting.module.scss';

export function Setting() {
  // Redux
  const dispatch = useAppDispatch();
  const setting = useAppSelector((state) => state.setting);
  const { theme, notice, pauseFrequency, initData } = setting;
  const themeLight = theme === 'light';
  const todos = useAppSelector((state) => state.pomodoro.data);
  // Time conversion
  const minut = (second: number) => second / 60;
  const second = (minut: number) => minut * 60;
  // React State
  const [workTime, setWorkTime] = useState(minut(initData.work));
  const [pauseShortTime, setPauseShortTime] = useState(
    minut(initData.pause.short)
  );
  const [pauseLongTime, setPauseLongTime] = useState(
    minut(initData.pause.long)
  );
  const [countPauseFrequency, setCountPauseFrequency] =
    useState(pauseFrequency);
  const [enableNotice, setEnableNotice] = useState(notice);

  const valueComparison = (comparedArray: any[]): boolean =>
    JSON.stringify([
      second(workTime),
      second(pauseShortTime),
      second(pauseLongTime),
      countPauseFrequency,
      enableNotice,
    ]) === JSON.stringify(comparedArray);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    let data: ISettingСonfig = defaultSetting;
    // @ts-ignore
    if (e.nativeEvent.submitter.id === 'save')
      data = {
        pauseFrequency: Number(countPauseFrequency),
        notice: enableNotice,
        initData: {
          work: second(workTime),
          pause: {
            short: second(pauseShortTime),
            long: second(pauseLongTime),
          },
        },
      };

    setWorkTime(minut(data.initData.work));
    setPauseShortTime(minut(data.initData.pause.short));
    setPauseLongTime(minut(data.initData.pause.long));
    setCountPauseFrequency(data.pauseFrequency);
    setEnableNotice(data.notice);

    todos.forEach(({ id, setTime }) => {
      const timeWork = setTime.work - initData.work + data.initData.work;
      const timepauseShort =
        setTime.pause.short - initData.pause.short + data.initData.pause.short;
      const timepauseLong =
        setTime.pause.long - initData.pause.long + data.initData.pause.long;

      dispatch(
        setTodo({
          method: 'PATCH',
          data: {
            id,
            setTime: {
              work: timeWork <= 3600 ? timeWork : 3600,
              pause: {
                short: timepauseShort <= 900 ? timepauseShort : 900,
                long: timepauseLong <= 1800 ? timepauseLong : 1800,
              },
            },
          },
        })
      );
    });
    dispatch(setSetting(data));
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Настройки "Помидора"</h3>
      <form className={styles.form} onSubmit={preventDefault(handleSubmit)}>
        {LISTSETTING.map(({ value, min, max, ...props }) => (
          <label key={props.id} className={styles.label} htmlFor={props.id}>
            <span className={styles.label__box}>
              <span className={styles.label__desc}>{value.desc}</span>
              {props.name !== 'notice' && (
                <span className={styles.label__note}>{value.note}</span>
              )}
            </span>
            <input
              {...props}
              className={styles.input}
              {...(props.name !== 'notice' && {
                style: {
                  backgroundColor: colorTheme(theme === 'light' ? 96 : 30),
                },
                value:
                  props.name === 'work'
                    ? workTime
                    : props.name === 'pauseShort'
                    ? pauseShortTime
                    : props.name === 'pauseLong'
                    ? pauseLongTime
                    : props.name === 'pauseFrequency'
                    ? countPauseFrequency
                    : '',
                onChange: (e) => {
                  const value = Number(e.currentTarget.value);
                  props.name === 'work'
                    ? setWorkTime(value)
                    : props.name === 'pauseShort'
                    ? setPauseShortTime(value)
                    : props.name === 'pauseLong'
                    ? setPauseLongTime(value)
                    : props.name === 'pauseFrequency' &&
                      setCountPauseFrequency(value);
                },
                onBlur: (e) => {
                  const value = Number(e.currentTarget.value);
                  const finallyValue =
                    value >= max ? max : value <= min ? min : value;
                  props.name === 'work'
                    ? setWorkTime(finallyValue)
                    : props.name === 'pauseShort'
                    ? setPauseShortTime(finallyValue)
                    : props.name === 'pauseLong'
                    ? setPauseLongTime(finallyValue)
                    : props.name === 'pauseFrequency' &&
                      setCountPauseFrequency(finallyValue);
                },
              })}
              {...(props.name === 'notice' && {
                checked: enableNotice,
                onChange: (e) => setEnableNotice(e.currentTarget.checked),
              })}
            />
            {props.name === 'notice' && (
              <span
                className={styles.input__checkbox}
                style={{
                  backgroundColor: colorTheme(themeLight ? 10 : 100),
                }}
              >
                <Icon
                  active="checkbox"
                  size={25}
                  fill={colorTheme(themeLight ? 100 : 0)}
                />
              </span>
            )}
          </label>
        ))}
        <div className={styles.form__boxBtn}>
          {[
            {
              id: 'save',
              children: 'Сохранить',
              disabled: valueComparison([
                initData.work,
                initData.pause.short,
                initData.pause.long,
                pauseFrequency,
                notice,
              ]),
            },
            {
              id: 'default',
              children: 'По умолчанию',
              disabled: valueComparison([
                defaultSetting.initData.work,
                defaultSetting.initData.pause.short,
                defaultSetting.initData.pause.long,
                defaultSetting.pauseFrequency,
                defaultSetting.notice,
              ]),
            },
          ].map((props) => (
            <button
              key={`setting-btn-${props.id}`}
              type="submit"
              className={convertInString(
                'us-btn',
                'us-btn__run',
                styles.form__btn
              )}
              {...props}
            />
          ))}
        </div>
      </form>
    </div>
  );
}
