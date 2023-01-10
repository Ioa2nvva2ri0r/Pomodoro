import React, { useEffect, useState } from 'react';
// Redux
import { useAppSelector } from '../../redux/hooks';
// API
import axios from 'axios';
// Moment
import moment from 'moment';
// Utils
import { colorTheme } from '../../Utils/react/activeColor';
// Components
import { HeaderStatistics } from './HeaderStatistics';
import { MainStatistics } from './MainStatistics';
import IconPreloader from '../Common/Icon/IconPreloader';
// Styles-module
import styles from './statistics.module.scss';
// Types
import type { IOverallCompletedData } from '../../redux/slices/types/typesDataPomodoro';
interface IDataStatistics {
  thisWeek: IOverallCompletedData[];
  lastWeek: IOverallCompletedData[];
  twoWeeksAgo: IOverallCompletedData[];
}

const dateNow = moment().format('YYYY-MM-DD');
const dateStartThisWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
const dateStartLastWeek = moment()
  .subtract(1, 'weeks')
  .startOf('isoWeek')
  .format('YYYY-MM-DD');
const dateStartTwoWeeksAgo = moment()
  .subtract(2, 'weeks')
  .startOf('isoWeek')
  .format('YYYY-MM-DD');

export function Statistics() {
  // .env
  const env = process.env;
  // Redux
  const themeLight = useAppSelector((state) => state.setting.theme === 'light');
  const dataNowDay = useAppSelector(
    (state) => state.pomodoro.dataOverallCompleted
  );
  // React State
  const [data, setData] = useState<{} | IDataStatistics>({});
  const [activeWeek, setActiveWeek] = useState<TActiveWeek>('thisWeek');
  const [loadingData, setLoadingData] = useState(true);
  const [errGetData, setErrGetData] = useState('');

  useEffect(() => {
    axios(env.REACT_APP__CASE_REPOSITORY_PATH as string)
      .then((res) => {
        const data = res.data as IOverallCompletedData[];

        const weeklyActiveData = (startWeek: string, endWeek: string) =>
          data.filter((o) =>
            moment(o.dateCreated).isBetween(startWeek, endWeek, undefined, '[)')
          );

        setData({
          thisWeek: [
            ...weeklyActiveData(dateStartThisWeek, dateNow),
            dataNowDay,
          ],
          lastWeek: weeklyActiveData(dateStartLastWeek, dateStartThisWeek),
          twoWeeksAgo: weeklyActiveData(
            dateStartTwoWeeksAgo,
            dateStartLastWeek
          ),
        });
      })
      .catch(() =>
        setErrGetData(
          'Ошибка при получении данных! Пожалуста повторите операцию позже...'
        )
      )
      .finally(() => setLoadingData(false));
  }, []);

  useEffect(() => {
    if (Object.values(data).length !== 0)
      setData((prev: IDataStatistics) => ({
        ...prev,
        thisWeek: [...prev.thisWeek, dataNowDay],
      }));
    else setData({ thisWeek: [dataNowDay] });
  }, [dataNowDay]);

  return (
    <section className={styles.section}>
      {loadingData ? (
        <p className={styles.loading}>
          Подождите, идёт загрузка{' '}
          <IconPreloader stroke={colorTheme(themeLight ? 0 : 100)} />
        </p>
      ) : errGetData === '' ? (
        <>
          <HeaderStatistics
            activeWeek={activeWeek}
            setActiveWeek={setActiveWeek}
          />
          <MainStatistics
            activeWeek={activeWeek}
            dataWeek={(data as IDataStatistics)[activeWeek] || []}
          />
        </>
      ) : (
        <p className={styles.error}>{errGetData}</p>
      )}
    </section>
  );
}
