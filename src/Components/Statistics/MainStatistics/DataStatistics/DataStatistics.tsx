import React, { useState, useEffect } from 'react';
// Redux
import { useAppSelector } from '../../../../redux/hooks';
// Utils
import { convertInString, convertTime } from '../../../../Utils/js/сonvert';
import { colorTheme } from '../../../../Utils/react/activeColor';
// Components
import Icon from '../../../Common/Icon/Icon';
// Styles-module
import styles from './datastatistics.module.scss';
// Types
import type { IOverallCompletedData } from '../../../../redux/slices/types/typesDataPomodoro';
interface IDataStatisticsProps {
  dataDay: undefined | IOverallCompletedData;
}

export function DataStatistics({ dataDay }: IDataStatisticsProps) {
  // Redux
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');
  // React State
  const [focus, setFocus] = useState(0);
  const [timePause, setTimePause] = useState(0);
  const [stops, setStops] = useState(0);

  useEffect(() => {
    if (dataDay && dataDay.count.pomodoro !== 0) {
      const { time, count } = dataDay;
      const calcFocus = Math.round((time.spent * 100) / time.work);

      setFocus(calcFocus === 0 ? 1 : calcFocus);
      setTimePause(time.pause);
      setStops(count.stop);
    } else {
      setFocus(0);
      setTimePause(0);
      setStops(0);
    }
  }, [dataDay]);

  return (
    <div className={styles.container}>
      {Object.entries({
        focus: {
          title: 'Фокус',
          desc: focus,
          color: { background: '#FFDDA9', stroke: '#FFAE35' },
        },
        timePause: {
          title: 'Время на паузе',
          desc: timePause,
          color: { background: '#DFDCFE', stroke: '#9C97D7' },
        },
        stops: {
          title: 'Остановки',
          desc: stops,
          color: { background: '#C5F1FF', stroke: '#7FC2D7' },
        },
      }).map(([key, value]) => (
        <div
          key={`box-statistics-${key}`}
          className={convertInString(styles.box, styles[`box__${key}`])}
          style={{
            backgroundColor:
              value.desc !== 0
                ? value.color.background
                : colorTheme(themeLight ? 96 : 30),
            color:
              value.desc !== 0 ? colorTheme(themeLight ? 0 : 0) : 'inherit',
          }}
        >
          <div className={styles.titleData__box}>
            <h2 className={styles.title}>{value.title}</h2>
            <strong className={styles.data}>{`${
              key === 'focus'
                ? `${value.desc}%`
                : key === 'timePause'
                ? convertTime(timePause, true)
                : value.desc
            }`}</strong>
          </div>
          <Icon
            active={key as 'focus' | 'timePause' | 'stops'}
            size={115}
            stroke={value.desc !== 0 ? value.color.stroke : undefined}
          />
        </div>
      ))}
    </div>
  );
}
