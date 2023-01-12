import React, { useEffect, useRef } from 'react';
// Redux
import { useAppSelector } from '../../../../redux/hooks';
// Moment
import moment from 'moment';
// Utils
import {
  capitalizedString,
  convertInString,
  convertTime,
} from '../../../../Utils/js/сonvert';
import { colorTheme } from '../../../../Utils/react/activeColor';
// Components
import IconPomodoro from '../../../Common/Icon/IconPomodoro';
import IconLogo from '../../../Common/Icon/IconLogo';
// Styles-module
import styles from './dataschedule.module.scss';
// Types
import type { IOverallCompletedData } from '../../../../redux/slices/types/typesDataPomodoro';
interface IDataScheduleProps {
  activeDay: TActiveDay;
  setActiveDay: React.Dispatch<React.SetStateAction<TActiveDay>>;
  dataWeek: [] | IOverallCompletedData[];
  dataDay: undefined | IOverallCompletedData;
}

export function DataSchedule({
  activeDay,
  setActiveDay,
  dataWeek,
  dataDay,
}: IDataScheduleProps) {
  const nameDay = (i: number, f: 'dd' | 'dddd') =>
    moment().isoWeekday(i).format(f);
  // Redux
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');
  // React Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const chekDataDay = dataDay && dataDay.count.pomodoro !== 0;
  const lastSymbolTask = () =>
    Number((dataDay?.count.pomodoro || 0).toString().slice(-1));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctxSchedule = canvas.getContext('2d');
      if (ctxSchedule) {
        // Сanvas cleaning
        ctxSchedule.clearRect(0, 0, canvas.width, canvas.height);
        // Сanvas setup
        ctxSchedule.imageSmoothingEnabled = false;

        [1500, 3000, 4500, 6000].map((label) => {
          const percent = Math.round((label * 100) / 7500);
          const columnHeigth = Math.round((canvas.height * percent) / 100);
          const y = canvas.height - columnHeigth + 0.5;

          ctxSchedule.beginPath();
          ctxSchedule.moveTo(0, y);
          ctxSchedule.lineTo(canvas.width, y);
          ctxSchedule.stroke();

          ctxSchedule.lineWidth = 0.5;
          ctxSchedule.fillStyle = '#333333';
        });

        dataWeek
          .concat(...new Array(6))
          .slice(0, 7)
          .map((obj, i) => {
            const amount = !obj || obj.time.spent < 60 ? 60 : obj.time.spent;
            const percent = Math.round((amount * 100) / 7500);
            const columnHeigth = Math.round((canvas.height * percent) / 100);
            const x = 20 + i * 39;
            const y = canvas.height - columnHeigth;

            ctxSchedule.fillStyle =
              !obj || (obj && obj.count.pomodoro === 0)
                ? '#C4C4C4'
                : obj && moment(obj.dateCreated).format('dddd') === activeDay
                ? '#DC3E22'
                : '#EA8A79';

            ctxSchedule.fillRect(x, y, 27, amount);
          });
      }
    }
  }, [dataWeek, canvasRef.current, activeDay]);

  return (
    <div className={styles.container}>
      <div
        className={convertInString(styles.box, styles.box__data)}
        style={{
          backgroundColor: colorTheme(themeLight ? 96 : 30),
        }}
      >
        <h2 className={styles.data__title}>{capitalizedString(activeDay)}</h2>
        <p className={styles.data__desc}>
          {chekDataDay ? (
            <>
              Вы работали над задачами в течении{' '}
              <span className={styles['data__desc-alert']}>
                {convertTime(dataDay.time.spent)}
              </span>
            </>
          ) : (
            'Нет данных'
          )}
        </p>
      </div>
      <div
        className={convertInString(
          styles.box,
          styles.box__pomodoro,
          chekDataDay && styles['box__pomodoro-active']
        )}
        style={{
          backgroundColor: colorTheme(themeLight ? 96 : 30),
        }}
      >
        {chekDataDay ? (
          <>
            <strong className={styles.pomodoro__count}>
              <IconLogo /> x {dataDay.count.pomodoro}
            </strong>
            <strong className={styles.pomodoro__text}>
              {dataDay.count.pomodoro} помидор
              {lastSymbolTask() === 0 ||
              lastSymbolTask() >= 5 ||
              (dataDay.count.pomodoro >= 10 && dataDay.count.pomodoro <= 20)
                ? 'ов'
                : lastSymbolTask() >= 2 && lastSymbolTask() <= 4
                ? 'а'
                : ''}
            </strong>
          </>
        ) : (
          <IconPomodoro />
        )}
      </div>
      <div
        className={convertInString(styles.box, styles.box__schedule)}
        style={{
          backgroundColor: colorTheme(themeLight ? 96 : 30),
        }}
      >
        <div className={styles.schedule__container}>
          <canvas ref={canvasRef} className={styles.schedule}>
            Ваш браузер не поддерживает отрисовку статистики!
          </canvas>
          <ul className={styles['schedule__list-times']}>
            {['1 ч 40 мин', '1 ч 15 мин', '50 мин', '25 мин'].map((el, i) => (
              <li
                key={`schedule-time-${i + 1}`}
                className={styles['schedule__item-times']}
              >
                <strong className={styles['schedule__desc-times']}>{el}</strong>
              </li>
            ))}
          </ul>
        </div>
        <ul
          className={styles['schedule__list-days']}
          style={{ backgroundColor: colorTheme(themeLight ? 93 : 17) }}
        >
          {[...new Array(7)].map((_, i) => (
            <li
              key={`weekDay-${i + 1}`}
              className={styles['schedule__item-days']}
            >
              <button
                className={convertInString(
                  styles.schedule__btn,
                  (nameDay(i + 1, 'dddd') as TActiveDay) === activeDay &&
                    styles['schedule__btn-active']
                )}
                style={{ color: colorTheme(themeLight ? 60 : 100) }}
                onClick={() => {
                  setActiveDay(nameDay(i + 1, 'dddd') as TActiveDay);
                }}
              >
                {capitalizedString(nameDay(i + 1, 'dd'))}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
