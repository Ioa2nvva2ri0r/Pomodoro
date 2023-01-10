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
// Static-data
import { LISTSETTING } from '../../Common/static';
// Styles-module
import styles from './setting.module.scss';
import Icon from '../../Common/Icon/Icon';

export function Setting() {
  // Redux
  const dispatch = useAppDispatch();
  const setting = useAppSelector((state) => state.setting);
  const { theme, notice, breakFrequency, initData } = setting;
  const themeLight = theme === 'light';
  const todos = useAppSelector((state) => state.pomodoro.data);
  // Time conversion
  const minut = (second: number) => second / 60;
  const second = (minut: number) => minut * 60;
  // React State
  const [workTime, setWorkTime] = useState(minut(initData.work));
  const [breakShortTime, setBreakShortTime] = useState(
    minut(initData.break.short)
  );
  const [breakLongTime, setBreakLongTime] = useState(
    minut(initData.break.long)
  );
  const [countBreakFrequency, setCountBreakFrequency] =
    useState(breakFrequency);
  const [enableNotice, setEnableNotice] = useState(notice);

  const valueComparison = (comparedArray: any[]): boolean =>
    JSON.stringify([
      second(workTime),
      second(breakShortTime),
      second(breakLongTime),
      countBreakFrequency,
      enableNotice,
    ]) === JSON.stringify(comparedArray);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    let data: ISettingСonfig = defaultSetting;
    // @ts-ignore
    if (e.nativeEvent.submitter.id === 'save')
      data = {
        breakFrequency: Number(countBreakFrequency),
        notice: enableNotice,
        initData: {
          work: second(workTime),
          break: {
            short: second(breakShortTime),
            long: second(breakLongTime),
          },
        },
      };

    setWorkTime(minut(data.initData.work));
    setBreakShortTime(minut(data.initData.break.short));
    setBreakLongTime(minut(data.initData.break.long));
    setCountBreakFrequency(data.breakFrequency);
    setEnableNotice(data.notice);

    todos.forEach(({ id, setTime }) => {
      const timeWork = setTime.work - initData.work + data.initData.work;
      const timeBreakShort =
        setTime.break.short - initData.break.short + data.initData.break.short;
      const timeBreakLong =
        setTime.break.long - initData.break.long + data.initData.break.long;

      dispatch(
        setTodo({
          method: 'PATCH',
          data: {
            id,
            setTime: {
              work: timeWork <= 3600 ? timeWork : 3600,
              break: {
                short: timeBreakShort <= 900 ? timeBreakShort : 900,
                long: timeBreakLong <= 1800 ? timeBreakLong : 1800,
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
                    : props.name === 'breakShort'
                    ? breakShortTime
                    : props.name === 'breakLong'
                    ? breakLongTime
                    : props.name === 'breakFrequency'
                    ? countBreakFrequency
                    : '',
                onChange: (e) => {
                  const value = Number(e.currentTarget.value);
                  props.name === 'work'
                    ? setWorkTime(value)
                    : props.name === 'breakShort'
                    ? setBreakShortTime(value)
                    : props.name === 'breakLong'
                    ? setBreakLongTime(value)
                    : props.name === 'breakFrequency' &&
                      setCountBreakFrequency(value);
                },
                onBlur: (e) => {
                  const value = Number(e.currentTarget.value);
                  const finallyValue =
                    value >= max ? max : value <= min ? min : value;
                  props.name === 'work'
                    ? setWorkTime(finallyValue)
                    : props.name === 'breakShort'
                    ? setBreakShortTime(finallyValue)
                    : props.name === 'breakLong'
                    ? setBreakLongTime(finallyValue)
                    : props.name === 'breakFrequency' &&
                      setCountBreakFrequency(finallyValue);
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
                initData.break.short,
                initData.break.long,
                breakFrequency,
                notice,
              ]),
            },
            {
              id: 'default',
              children: 'По умолчанию',
              disabled: valueComparison([
                defaultSetting.initData.work,
                defaultSetting.initData.break.short,
                defaultSetting.initData.break.long,
                defaultSetting.breakFrequency,
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
