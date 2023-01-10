import React, { useState, useEffect } from 'react';
// Moment
import moment from 'moment';
// Components
import { DataStatistics } from './DataStatistics';
import { DataSchedule } from './DataSchedule';
// Styles-module
import styles from './mainstatistics.module.scss';
// Types
import type { IOverallCompletedData } from '../../../redux/slices/types/typesDataPomodoro';
interface IMainStatisticsProps {
  activeWeek: TActiveWeek;
  dataWeek: [] | IOverallCompletedData[];
}

export function MainStatistics({ activeWeek, dataWeek }: IMainStatisticsProps) {
  // React State
  const [activeDay, setActiveDay] = useState<TActiveDay>(
    activeWeek === 'thisWeek'
      ? (moment().format('dddd') as TActiveDay)
      : 'Понедельник'
  );
  const [data, setData] = useState<undefined | IOverallCompletedData>();
  // React Effect
  useEffect(() => {
    if (dataWeek.length !== 0)
      setData(
        dataWeek.filter(
          (o) => moment(o.dateCreated).format('dddd') === activeDay
        )[0]
      );
  }, [dataWeek, activeDay, activeWeek]);

  return (
    <div className={styles.container}>
      <DataSchedule
        activeDay={activeDay}
        setActiveDay={setActiveDay}
        dataWeek={dataWeek}
        dataDay={data}
      />
      <DataStatistics dataDay={data} />
    </div>
  );
}
