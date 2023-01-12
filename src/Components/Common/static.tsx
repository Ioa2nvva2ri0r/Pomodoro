import { nanoid } from 'nanoid';
// Components
import Icon from './Icon/Icon';

export const LISTCONTROL = Object.entries({
  increase: 'Увеличить',
  decrease: 'Уменьшить',
  edit: 'Редактировать',
  delete: 'Удалить',
}).map(([key, value]) => ({
  key: nanoid(),
  action: key as TActionControls,
  children: (
    <>
      <Icon active={key as TIconName} size={16} />
      {value}
    </>
  ),
}));

export const LISTWEEK = Object.entries({
  thisWeek: 'Эта неделя',
  lastWeek: 'Прошедшая неделя',
  twoWeeksAgo: '2 недели назад',
}).map(([key, value]) => ({
  key: nanoid(),
  action: key as TActiveWeek,
  children: value,
}));

export const LISTSETTING = Object.entries({
  work: {
    min: 20,
    max: 60,
    type: 'number',
    desc: 'Продолжительность "Помидора"',
  },
  pauseShort: {
    min: 3,
    max: 15,
    type: 'number',
    desc: 'Продолжительность короткого перерыва',
  },
  pauseLong: {
    min: 15,
    max: 30,
    type: 'number',
    desc: 'Продолжительность длинного перерыва',
  },
  pauseFrequency: {
    min: 2,
    max: 10,
    type: 'number',
    desc: 'Частота длинных перерывов',
  },
  notice: { type: 'checkbox', desc: 'Уведомления' },
}).map(([key, value]) => ({
  id: nanoid(),
  type: value.type,
  name: key as TSetting,
  min: value.min as number,
  max: value.max as number,
  value: {
    desc: value.desc,
    note: `(Мин. значение: ${value.min}, макс. значение: ${value.max})`,
  },
}));

export const DESC = [
  'Выберите категорию и напишите название текущей задачи',
  'Запустите таймер («помидор»)',
  'Работайте пока «помидор» не прозвонит',
  'Сделайте короткий перерыв (3-5 минут)',
  'Продолжайте работать «помидор» за «помидором», пока задача не будут выполнена. Каждые 4 «помидора» делайте длинный перерыв (15-30 минут).',
].map((el) => ({ id: nanoid(), desc: el }));
