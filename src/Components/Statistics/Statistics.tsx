import React, { useEffect, useState } from 'react';
// Redux
import { useAppSelector } from '../../redux/hooks';
// API
import axios from 'axios';
// Moment
import moment from 'moment';
// Components
import { HeaderStatistics } from './HeaderStatistics';
import { MainStatistics } from './MainStatistics';
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
  const dataNowDay = useAppSelector(
    (state) => state.pomodoro.dataOverallCompleted
  );
  // React State
  const [data, setData] = useState<{} | IDataStatistics>({});
  const [activeWeek, setActiveWeek] = useState<TActiveWeek>('thisWeek');

  useEffect(() => {
    axios(env.REACT_APP__CASE_REPOSITORY_PATH as string).then((res) => {
      const data = res.data as IOverallCompletedData[];

      const weeklyActiveData = (startWeek: string, endWeek: string) =>
        data.filter((o) =>
          moment(o.dateCreated).isBetween(startWeek, endWeek, undefined, '[)')
        );

      setData({
        thisWeek: [...weeklyActiveData(dateStartThisWeek, dateNow), dataNowDay],
        lastWeek: weeklyActiveData(dateStartLastWeek, dateStartThisWeek),
        twoWeeksAgo: weeklyActiveData(dateStartTwoWeeksAgo, dateStartLastWeek),
      });
    });
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
      <HeaderStatistics activeWeek={activeWeek} setActiveWeek={setActiveWeek} />
      <MainStatistics
        activeWeek={activeWeek}
        dataWeek={(data as IDataStatistics)[activeWeek] || []}
      />
    </section>
  );
}
